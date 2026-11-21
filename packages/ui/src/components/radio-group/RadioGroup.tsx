"use client";

import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useMemo,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

import { cx, useControllableState } from "@jo-ui/ui-core";

import * as choice from "../choice/Choice.css";
import * as styles from "./RadioGroup.css";

interface RadioGroupContextValue {
  name: string;
  value: string;
  setValue: (value: string) => void;
  required: boolean;
  invalid: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

export interface RadioGroupProps
  extends Omit<ComponentPropsWithoutRef<"fieldset">, "onChange" | "defaultValue"> {
  /** The question the options answer. Rendered as the fieldset's <legend>. */
  label: ReactNode;
  hint?: ReactNode;
  /** Error message. Marks the group invalid and is announced with it. */
  error?: ReactNode;
  /** Controlled selected value. Use "" for nothing selected. */
  value?: string;
  /** Starting value when uncontrolled. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** The form field name. Generated if omitted (radios need one to group). */
  name?: string;
  required?: boolean;
  /** Default "vertical". */
  orientation?: "vertical" | "horizontal";
  /** Radio children. */
  children: ReactNode;
}

/**
 * Pick one of several options. Native radios sharing a `name`, so the browser
 * provides the APG radio group keyboard behavior: Tab enters the group once,
 * arrow keys move and select, Tab leaves.
 *
 *   <RadioGroup label="Plan" defaultValue="free">
 *     <Radio value="free">Free</Radio>
 *     <Radio value="pro" description="$8/month">Pro</Radio>
 *   </RadioGroup>
 */
export const RadioGroup = forwardRef<HTMLFieldSetElement, RadioGroupProps>(function RadioGroup(
  {
    label,
    hint,
    error,
    value: valueProp,
    defaultValue = "",
    onValueChange,
    name: nameProp,
    required = false,
    orientation = "vertical",
    className,
    children,
    ...rest
  },
  ref,
) {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  const autoId = useId();
  const name = nameProp ?? autoId;
  const hintId = hint ? `${autoId}hint` : undefined;
  const errorId = error ? `${autoId}error` : undefined;
  const invalid = Boolean(error);

  const context = useMemo(
    () => ({ name, value, setValue, required, invalid }),
    [name, value, setValue, required, invalid],
  );

  return (
    <RadioGroupContext.Provider value={context}>
      {/* fieldset + legend: the native way to group related controls and give
          the group a name. A disabled fieldset disables every radio inside. */}
      <fieldset
        ref={ref}
        className={cx(styles.group, className)}
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
        {...rest}
      >
        <legend className={styles.legend}>
          {label}
          {required && (
            <span aria-hidden className={styles.requiredMark}>
              {" *"}
            </span>
          )}
        </legend>
        {hint && (
          <p id={hintId} className={styles.hint}>
            {hint}
          </p>
        )}
        <div className={styles.options[orientation]}>{children}</div>
        {error && (
          <p id={errorId} className={styles.error}>
            {error}
          </p>
        )}
      </fieldset>
    </RadioGroupContext.Provider>
  );
});

export interface RadioProps
  extends Omit<ComponentPropsWithoutRef<"input">, "type" | "name" | "value" | "checked" | "defaultChecked" | "onChange" | "size"> {
  /** The value this option stands for. */
  value: string;
  /** The label. */
  children?: ReactNode;
  /** Smaller help text under the label, announced with it. */
  description?: ReactNode;
}

/** One option in a RadioGroup. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, children, description, disabled, id, className, style, "aria-describedby": describedByProp, ...rest },
  ref,
) {
  const group = useContext(RadioGroupContext);
  if (!group) throw new Error("<Radio> must be used inside a <RadioGroup>.");

  const autoId = useId();
  const inputId = id ?? autoId;
  const descriptionId = description ? `${inputId}-description` : undefined;

  return (
    <div className={cx(choice.root, className)} style={style} data-disabled={disabled ? "" : undefined}>
      <span className={choice.controlWrap}>
        <input
          ref={ref}
          type="radio"
          id={inputId}
          name={group.name}
          value={value}
          className={styles.input}
          checked={group.value === value}
          onChange={() => group.setValue(value)}
          disabled={disabled}
          required={group.required || undefined}
          aria-invalid={group.invalid || undefined}
          aria-describedby={[descriptionId, describedByProp].filter(Boolean).join(" ") || undefined}
          {...rest}
        />
      </span>
      {(children || description) && (
        <span className={choice.text}>
          {children && (
            <label htmlFor={inputId} className={choice.label}>
              {children}
            </label>
          )}
          {description && (
            <span id={descriptionId} className={choice.description}>
              {description}
            </span>
          )}
        </span>
      )}
    </div>
  );
});
