import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "../../theme/vars.css";

// --- Loading spinner -----------------------------------------------------------

const spin = keyframes({ to: { transform: "rotate(360deg)" } });

export const spinner = style({
  flexShrink: 0,
  animationName: spin,
  animationDuration: `calc(${vars.motion.duration.slower} * 2)`, // one turn per second
  animationTimingFunction: "linear",
  animationIterationCount: "infinite",
  "@media": {
    // Still spins (it's how the user knows something is happening), just slower.
    "(prefers-reduced-motion: reduce)": {
      animationDuration: `calc(${vars.motion.duration.slower} * 6)`,
    },
  },
});


export const button = recipe({
  // Styles every button gets, whatever its props.
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: vars.space[2],
    margin: 0,
    // A transparent border keeps every variant the same size (outline adds a
    // visible one), and in Windows High Contrast mode it becomes visible, so
    // solid buttons still have an edge.
    border: "1px solid transparent",
    borderRadius: vars.radius.md,
    fontFamily: "inherit",
    fontWeight: vars.font.weight.semibold,
    lineHeight: vars.font["line-height"].tight,
    whiteSpace: "nowrap",
    textDecoration: "none",
    cursor: "pointer",
    transitionProperty: "background-color, border-color, color",
    transitionDuration: vars.motion.duration.fast,
    transitionTimingFunction: vars.motion.easing.standard,

    selectors: {
      // Keyboard focus only; mouse clicks don't show the ring. Never remove it.
      "&:focus-visible": {
        outline: `2px solid ${vars.color.border.focus}`,
        outlineOffset: "2px",
      },
      // aria-disabled covers asChild links, which can't use the disabled attribute.
      "&:disabled, &[aria-disabled='true']": {
        cursor: "not-allowed",
        opacity: 0.5, // disabled controls are exempt from WCAG contrast
      },
      // Loading is also disabled (to block clicks) but shouldn't look faded.
      // Listed after :disabled so it wins.
      "&[data-loading]": {
        cursor: "progress",
        opacity: 1,
      },
    },

    "@media": {
      "(prefers-reduced-motion: reduce)": {
        transitionDuration: vars.motion.duration.instant,
      },
    },
  },

  variants: {
    // Heights: 32 / 40 / 48px. All above WCAG 2.2's 24px minimum target size.
    size: {
      sm: {
        height: vars.space[8],
        paddingInline: vars.space[3],
        fontSize: vars.font.size.sm,
      },
      md: {
        height: vars.space[10],
        paddingInline: vars.space[4],
        fontSize: vars.font.size.md,
      },
      lg: {
        height: vars.space[12],
        paddingInline: vars.space[5],
        fontSize: vars.font.size.lg,
      },
    },

    // What each variant does on its own. Colors depend on the tone too, so
    // they live in compoundVariants below.
    variant: {
      solid: {},
      outline: {
        background: "transparent",
        borderColor: "currentColor", // the border matches the text color
      },
      ghost: {
        background: "transparent",
      },
    },

    tone: {
      accent: {},
      danger: {},
    },
  },

  // One entry per variant Ã— tone combination.
  // Hover is skipped when disabled, so a disabled button doesn't react.
  compoundVariants: [
    {
      variants: { variant: "solid", tone: "accent" },
      style: {
        background: vars.color.bg.accent,
        color: vars.color.text["on-accent"],
        selectors: { "&:hover:not(:disabled, [aria-disabled='true'])": { background: vars.color.bg["accent-hover"] } },
      },
    },
    {
      variants: { variant: "solid", tone: "danger" },
      style: {
        background: vars.color.bg.danger,
        color: vars.color.text["on-danger"],
        selectors: { "&:hover:not(:disabled, [aria-disabled='true'])": { background: vars.color.bg["danger-hover"] } },
      },
    },
    {
      variants: { variant: "outline", tone: "accent" },
      style: {
        color: vars.color.text.accent,
        selectors: { "&:hover:not(:disabled, [aria-disabled='true'])": { background: vars.color.bg["accent-subtle"] } },
      },
    },
    {
      variants: { variant: "outline", tone: "danger" },
      style: {
        color: vars.color.text.danger,
        selectors: { "&:hover:not(:disabled, [aria-disabled='true'])": { background: vars.color.bg["danger-subtle"] } },
      },
    },
    {
      variants: { variant: "ghost", tone: "accent" },
      style: {
        color: vars.color.text.accent,
        selectors: { "&:hover:not(:disabled, [aria-disabled='true'])": { background: vars.color.bg["accent-subtle"] } },
      },
    },
    {
      variants: { variant: "ghost", tone: "danger" },
      style: {
        color: vars.color.text.danger,
        selectors: { "&:hover:not(:disabled, [aria-disabled='true'])": { background: vars.color.bg["danger-subtle"] } },
      },
    },
  ],

  defaultVariants: {
    size: "md",
    variant: "solid",
    tone: "accent",
  },
});

// --- IconButton ----------------------------------------------------------------
// Must come AFTER the recipe: vanilla-extract outputs CSS in file order, and
// this overrides the size variants' paddingInline with the same specificity,
// so the later rule wins. Defined earlier, md's 16px padding would win and
// the "square" button would be 54px wide.

/** Square: same width as height, so sm/md/lg are 32/40/48px squares. */
export const iconOnly = style({
  paddingInline: 0,
  aspectRatio: "1 / 1",
});

// Icons default to 1em; a bit larger reads better when it's the only content.
globalStyle(`${iconOnly} > svg`, {
  width: "1.25em",
  height: "1.25em",
});

/** { size?: "sm" | "md" | "lg"; variant?: ...; tone?: ... }, derived from the recipe above. */
export type ButtonVariants = NonNullable<RecipeVariants<typeof button>>;
