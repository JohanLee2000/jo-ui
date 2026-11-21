import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { vars } from "../../theme/vars.css";

/** Shared by Input and Textarea, so text controls always look the same. */
export const textControl = recipe({
  base: {
    boxSizing: "border-box",
    width: "100%",
    margin: 0,
    fontFamily: "inherit",
    color: vars.color.text.primary,
    background: vars.color.bg.surface,
    // border.strong meets WCAG's 3:1 contrast for a control's boundary,
    // so people can see where to click.
    border: `1px solid ${vars.color.border.strong}`,
    borderRadius: vars.radius.md,
    paddingInline: vars.space[3],
    transitionProperty: "border-color, outline-color",
    transitionDuration: vars.motion.duration.fast,
    transitionTimingFunction: vars.motion.easing.standard,

    "::placeholder": {
      color: vars.color.text.muted,
      opacity: 1, // Firefox fades placeholders by default
    },

    selectors: {
      // Text fields show focus on click too: you need to see where you're typing.
      "&:focus": {
        outline: `2px solid ${vars.color.border.focus}`,
        outlineOffset: "1px",
      },
      // Set by Field when there's an error. Color isn't the only signal:
      // the error text is shown and announced too.
      "&[aria-invalid='true']": {
        borderColor: vars.color.border.danger,
      },
      "&[aria-invalid='true']:focus": {
        outlineColor: vars.color.border.danger,
      },
      "&:disabled": {
        cursor: "not-allowed",
        opacity: 0.5,
        background: vars.color.bg.subtle,
      },
    },

    "@media": {
      "(prefers-reduced-motion: reduce)": {
        transitionDuration: vars.motion.duration.instant,
      },
    },
  },

  variants: {
    // Heights match Button's, so inputs and buttons line up in a row.
    // md and lg use 16px+ text: iOS Safari zooms the page into any input
    // with smaller text when it's focused.
    size: {
      sm: { height: vars.space[8], fontSize: vars.font.size.sm },
      md: { height: vars.space[10], fontSize: vars.font.size.md },
      lg: { height: vars.space[12], fontSize: vars.font.size.lg },
    },
    // Textarea: grows with rows instead of a fixed height. Declared after
    // `size`, so its height wins.
    multiline: {
      true: {
        height: "auto",
        paddingBlock: vars.space[2],
        lineHeight: vars.font["line-height"].normal,
        resize: "vertical",
      },
      false: {},
    },
  },

  defaultVariants: { size: "md", multiline: false },
});

export type TextControlSize = NonNullable<NonNullable<RecipeVariants<typeof textControl>>["size"]>;
