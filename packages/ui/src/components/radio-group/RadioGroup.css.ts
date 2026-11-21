import { style, styleVariants } from "@vanilla-extract/css";

import { vars } from "../../theme/vars.css";
import { box } from "../choice/Choice.css";
import { error as fieldError, hint as fieldHint, label as fieldLabel, requiredMark } from "../field/Field.css";

/** <fieldset> with the browser's border and padding removed. */
export const group = style({
  display: "grid",
  gap: vars.space[2],
  minWidth: 0, // fieldsets default to min-width: min-content, which breaks layouts
  margin: 0,
  padding: 0,
  border: 0,
});

// Same look as Field's label, hint and error, so a RadioGroup sits naturally
// in a form next to Inputs.
export const legend = style([fieldLabel, { padding: 0, marginBottom: vars.space[1] }]);
export { fieldHint as hint, fieldError as error, requiredMark };

export const options = styleVariants({
  vertical: { display: "grid", gap: vars.space[3] },
  horizontal: { display: "flex", flexWrap: "wrap", columnGap: vars.space[6], rowGap: vars.space[3] },
});

/** A round box; when checked, an accent fill with a surface-colored ring inside makes the dot. */
export const input = style([
  box,
  {
    borderRadius: vars.radius.full,
    selectors: {
      "&:checked": {
        background: vars.color.bg.accent,
        borderColor: vars.color.bg.accent,
        boxShadow: `inset 0 0 0 3px ${vars.color.bg.surface}`,
      },
    },
  },
]);
