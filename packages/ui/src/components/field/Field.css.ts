import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/vars.css";

export const field = style({
  display: "grid",
  gap: vars.space[2],
  minWidth: 0, // lets the field shrink inside grid/flex layouts
});

export const label = style({
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  lineHeight: vars.font["line-height"].snug,
  color: vars.color.text.primary,
  selectors: {
    [`${field}[data-disabled] &`]: { opacity: 0.5 },
  },
});

export const requiredMark = style({
  color: vars.color.text.danger,
});

export const hint = style({
  margin: 0,
  fontSize: vars.font.size.sm,
  lineHeight: vars.font["line-height"].normal,
  color: vars.color.text.muted,
});

export const error = style({
  margin: 0,
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  lineHeight: vars.font["line-height"].normal,
  color: vars.color.text.danger,
});
