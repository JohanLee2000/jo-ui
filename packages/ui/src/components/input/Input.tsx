import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { cx } from "@jo-ui/ui-core";

import { useFieldControl } from "../field/Field";
import { textControl, type TextControlSize } from "./Input.css";

export interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "size"> {
  /** Height and text size, matching Button sizes. Default "md". */
  size?: TextControlSize;
}

/**
 * A native text input (type="text", "email", "password", "search"...).
 * Put it inside a Field to give it a label, hint and error.
 *
 * Works controlled (value + onChange) or uncontrolled (defaultValue), exactly
 * like a plain <input>, because it is one.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size, className, ...rest },
  ref,
) {
  const props = useFieldControl(rest);
  return <input ref={ref} className={cx(textControl({ size }), className)} {...props} />;
});
