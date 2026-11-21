"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

import { cx, useControllableState, useMergedRefs } from "@jo-ui/ui-core";

import * as choice from "../choice/Choice.css";
import * as styles from "./Checkbox.css";

export type CheckedState = boolean | "indeterminate";

export interface CheckboxProps
  extends Omit<ComponentPropsWithoutRef<"input">, "type" | "checked" | "defaultChecked" | "onChange" | "size"> {
  /** Controlled state. "indeterminate" shows a dash, e.g. a "select all" that's partly selected. */
  checked?: CheckedState;
  /** Starting state when uncontrolled. */
  defaultChecked?: CheckedState;
  /** Called with the new state when the user toggles it. */
  onCheckedChange?: (checked: boolean) => void;
  /** The label. Clicking it toggles the checkbox. */
  children?: ReactNode;
  /** Smaller help text under the label, announced with it. */
  description?: ReactNode;
}

/**
 * A native checkbox with a custom look. Space toggles it, clicking the label
 * toggles it, and it submits with forms like any checkbox.
 *
 *   <Checkbox defaultChecked>Remember me</Checkbox>
 *   <Checkbox checked={agreed} onCheckedChange={setAgreed}>I agree</Checkbox>
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    checked,
    defaultChecked = false,
    onCheckedChange,
    children,
    description,
    disabled,
    id,
    className,
    style,
    "aria-describedby": describedByProp,
    ...rest
  },
  ref,
) {
  // Controlled or uncontrolled, the README §9 way.
  const [state, setState] = useControllableState<CheckedState>({
    prop: checked,
    defaultProp: defaultChecked,
    onChange: (next) => onCheckedChange?.(next === true),
  });

  // "indeterminate" isn't an HTML attribute; it can only be set from JS.
  // The browser then exposes it to screen readers as "mixed".
  const inputRef = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRefs(ref, inputRef);
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = state === "indeterminate";
  }, [state]);

  const autoId = useId();
  const inputId = id ?? autoId;
  const descriptionId = description ? `${inputId}-description` : undefined;

  return (
    <div className={cx(choice.root, className)} style={style} data-disabled={disabled ? "" : undefined}>
      <span className={choice.controlWrap}>
        <input
          ref={mergedRef}
          type="checkbox"
          id={inputId}
          className={styles.input}
          checked={state === true}
          onChange={(event) => setState(event.currentTarget.checked)}
          disabled={disabled}
          aria-describedby={[descriptionId, describedByProp].filter(Boolean).join(" ") || undefined}
          {...rest}
        />
        <svg className={styles.checkIcon} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M5 10.5l3.5 3.5L15 6.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg className={styles.dashIcon} viewBox="0 0 20 20" fill="none" aria-hidden>
          <path d="M5.5 10h9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
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
