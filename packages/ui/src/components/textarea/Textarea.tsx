import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { cx } from "@jo-ui/ui-core";

import { useFieldControl } from "../field/Field";
import { textControl, type TextControlSize } from "../input/Input.css";

export interface TextareaProps extends ComponentPropsWithoutRef<"textarea"> {
  /** Text size, matching Input. Default "md". */
  size?: TextControlSize;
}

/**
 * Multi-line text, styled to match Input. The user can resize it vertically.
 * Put it inside a Field to give it a label, hint and error.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { size, rows = 3, className, ...rest },
  ref,
) {
  const props = useFieldControl(rest);
  return (
    <textarea ref={ref} rows={rows} className={cx(textControl({ size, multiline: true }), className)} {...props} />
  );
});
