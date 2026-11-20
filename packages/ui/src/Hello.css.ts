import { style } from "@vanilla-extract/css";

import { vars } from "./theme/vars.css";

// Compiled at build time into a static CSS class. Every value is a token,
// so it follows the theme automatically.
export const root = style({
  margin: 0, // components never add outer spacing; that's the parent's job (README §9)
  padding: `${vars.space[2]} ${vars.space[3]}`,
  borderRadius: vars.radius.md,
  color: vars.color.text.accent,
  fontWeight: vars.font.weight.medium,
  transitionProperty: "background-color",
  transitionDuration: vars.motion.duration.fast,
  transitionTimingFunction: vars.motion.easing.standard,

  ":hover": {
    backgroundColor: vars.color.bg["accent-subtle"],
  },

  // Respect users who've asked their OS for less motion.
  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transitionDuration: vars.motion.duration.instant,
    },
  },
});
