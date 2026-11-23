import { globalStyle, keyframes, style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/vars.css";

const enter = keyframes({
  from: { opacity: 0, transform: "translateY(8px) scale(0.98)" },
  to: { opacity: 1, transform: "none" },
});

const fadeIn = keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

/**
 * The <dialog> element itself. It has no padding: a click whose target is the
 * <dialog> element can then only have landed on its ::backdrop, which is how
 * backdrop clicks are detected. The visible padding lives on `panel`.
 */
export const dialog = style({
  boxSizing: "border-box",
  width: `calc(100% - 2 * ${vars.space[4]})`,
  maxHeight: `calc(100dvh - 2 * ${vars.space[6]})`, // dvh: the visible height on mobile, minus browser bars
  margin: "auto",
  padding: 0,
  overflow: "auto",
  color: vars.color.text.primary,
  background: vars.color.bg.surface,
  border: `1px solid ${vars.color.border.default}`,
  borderRadius: vars.radius.xl,
  boxShadow: vars.shadow.lg,

  selectors: {
    "&[open]": {
      animationName: enter,
      animationDuration: vars.motion.duration.normal,
      animationTimingFunction: vars.motion.easing.enter,
    },
  },

  "@media": {
    "(prefers-reduced-motion: reduce)": {
      selectors: { "&[open]": { animationName: fadeIn } },
    },
  },
});

// The dimmed page behind a modal dialog. No z-index anywhere: modal dialogs
// live in the browser's "top layer", above everything else on the page.
globalStyle(`${dialog}::backdrop`, {
  background: vars.color.bg.overlay,
  animationName: fadeIn,
  animationDuration: vars.motion.duration.normal,
});

export const sizes = styleVariants({
  sm: { maxWidth: "24rem" },
  md: { maxWidth: "32rem" },
  lg: { maxWidth: "48rem" },
});

export const panel = style({
  display: "grid",
  gap: vars.space[4],
  padding: vars.space[6],
});

export const header = style({
  display: "grid",
  gap: vars.space[2],
  // Room for an absolutely positioned close button in the corner.
  paddingRight: vars.space[8],
});

export const title = style({
  margin: 0,
  fontSize: vars.font.size.lg,
  fontWeight: vars.font.weight.semibold,
  lineHeight: vars.font["line-height"].snug,
});

export const description = style({
  margin: 0,
  fontSize: vars.font.size.sm,
  lineHeight: vars.font["line-height"].normal,
  color: vars.color.text.muted,
});

export const footer = style({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "flex-end",
  gap: vars.space[3],
  marginTop: vars.space[2],
});

export const cornerClose = style({
  position: "absolute",
  top: vars.space[3],
  right: vars.space[3],
});
