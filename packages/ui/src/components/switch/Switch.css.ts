import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/vars.css";
import { controlWrap } from "../choice/Choice.css";

// The 24px track already matches the label's first line, so no nudge needed.
export const wrap = style([controlWrap, { marginTop: 0 }]);

// The native input sits invisibly on top of the drawn track: it still gets
// the clicks, keyboard focus and screen reader semantics.
export const input = style({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  margin: 0,
  opacity: 0,
  cursor: "pointer",
  zIndex: 1,
  selectors: {
    "&:disabled": { cursor: "not-allowed" },
  },
});

// Off: a border.strong track (3:1 against the surface, so it's visible).
// On: the accent color. The thumb slides 16px.
export const track = style({
  position: "relative",
  display: "inline-flex",
  alignItems: "center",
  boxSizing: "border-box",
  width: vars.space[10], // 40px
  height: vars.space[6], // 24px
  padding: "2px",
  borderRadius: vars.radius.full,
  background: vars.color.border.strong,
  transitionProperty: "background-color",
  transitionDuration: vars.motion.duration.fast,
  transitionTimingFunction: vars.motion.easing.standard,

  selectors: {
    [`${input}:checked + &`]: { background: vars.color.bg.accent },
    [`${input}:focus-visible + &`]: {
      outline: `2px solid ${vars.color.border.focus}`,
      outlineOffset: "2px",
    },
    [`${input}:disabled + &`]: { opacity: 0.5 },
  },

  "@media": {
    "(prefers-reduced-motion: reduce)": { transitionDuration: vars.motion.duration.instant },
  },
});

export const thumb = style({
  width: vars.space[5], // 20px
  height: vars.space[5],
  borderRadius: vars.radius.full,
  background: vars.color.bg.surface,
  transitionProperty: "transform",
  transitionDuration: vars.motion.duration.fast,
  transitionTimingFunction: vars.motion.easing.standard,

  selectors: {
    [`${input}:checked + ${track} &`]: { transform: "translateX(16px)" },
  },

  "@media": {
    "(prefers-reduced-motion: reduce)": { transitionDuration: vars.motion.duration.instant },
  },
});
