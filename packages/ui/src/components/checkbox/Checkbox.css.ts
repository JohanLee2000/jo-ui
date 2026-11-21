import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/vars.css";
import { box } from "../choice/Choice.css";

export const input = style([
  box,
  {
    borderRadius: vars.radius.sm,
    selectors: {
      "&:checked, &:indeterminate": {
        background: vars.color.bg.accent,
        borderColor: vars.color.bg.accent,
      },
    },
  },
]);

// The check and dash are SVGs drawn over the input. They're hidden until
// the input's state shows them, and clicks pass straight through to the input.
const icon = style({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  color: vars.color.text["on-accent"],
  pointerEvents: "none",
  opacity: 0,
});

export const checkIcon = style([icon, { selectors: { [`${input}:checked ~ &`]: { opacity: 1 } } }]);
export const dashIcon = style([icon, { selectors: { [`${input}:indeterminate ~ &`]: { opacity: 1 } } }]);
