// Layout shared by Checkbox, Radio and Switch: a control next to a label,
// with an optional description underneath the label.
import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/vars.css";

export const root = style({
  display: "flex",
  alignItems: "flex-start",
  gap: vars.space[3],
});

/** Holds the native input (and any visual parts drawn over it). */
export const controlWrap = style({
  position: "relative",
  display: "inline-flex",
  flexShrink: 0,
  // Centers a 20px control on the label's first 24px line (16px × 1.5).
  marginTop: "2px",
});

export const text = style({
  display: "grid",
  gap: vars.space[1],
});

export const label = style({
  fontSize: vars.font.size.md,
  lineHeight: vars.font["line-height"].normal,
  color: vars.color.text.primary,
  cursor: "pointer",
  selectors: {
    [`${root}[data-disabled] &`]: { cursor: "not-allowed", opacity: 0.5 },
  },
});

// Not faded when disabled, unlike the label: it often explains *why* the
// option is unavailable ("Available on the Pro plan"), so it must stay
// readable (WCAG AA contrast). The faded control and label already signal
// "disabled".
export const description = style({
  fontSize: vars.font.size.sm,
  lineHeight: vars.font["line-height"].normal,
  color: vars.color.text.muted,
});

/**
 * The native checkbox/radio itself, restyled. appearance: none removes the
 * browser's drawing but keeps everything that matters: keyboard support,
 * form submission, screen reader semantics.
 */
export const box = style({
  appearance: "none",
  boxSizing: "border-box",
  width: vars.space[5],
  height: vars.space[5],
  margin: 0,
  flexShrink: 0,
  background: vars.color.bg.surface,
  border: `2px solid ${vars.color.border.strong}`,
  cursor: "pointer",
  transitionProperty: "background-color, border-color, box-shadow",
  transitionDuration: vars.motion.duration.fast,
  transitionTimingFunction: vars.motion.easing.standard,

  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.border.focus}`,
      outlineOffset: "2px",
    },
    "&[aria-invalid='true']": {
      borderColor: vars.color.border.danger,
    },
    "&:disabled": {
      cursor: "not-allowed",
      opacity: 0.5,
    },
  },

  "@media": {
    "(prefers-reduced-motion: reduce)": {
      transitionDuration: vars.motion.duration.instant,
    },
  },
});
