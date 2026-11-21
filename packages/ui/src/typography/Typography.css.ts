import { style } from "@vanilla-extract/css";

import { vars } from "../theme/vars.css";

// Size, weight, color and family come from sprinkles (so size can be
// responsive). These are the fixed parts each component always has.

export const text = style({
  margin: 0, // browsers give <p> a margin; spacing is the parent's job (README §9)
  lineHeight: vars.font["line-height"].normal,
});

export const heading = style({
  margin: 0, // browsers give <h1>–<h6> margins too
  lineHeight: vars.font["line-height"].tight,
  letterSpacing: vars.font["letter-spacing"].tight,
  // Prevents an awkward single word on the last line of a heading.
  textWrap: "balance",
});

/** One line, cut off with "…" when it doesn't fit. */
export const truncate = style({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});
