"use client";

import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from "react";

import { cx, useControllableState } from "@jo-ui/ui-core";

import * as choice from "../choice/Choice.css";
import * as styles from "./Switch.css";

export interface SwitchProps
  extends Omit<ComponentPropsWithoutRef<"input">, "type" | "role" | "checked" | "defaultChecked" | "onChange" | "size"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** The label. Clicking it toggles the switch. */
  children?: ReactNode;
  /** Smaller help text under the label, announced with it. */
  description?: ReactNode;
}

/**
 * An on/off toggle for a setting that takes effect immediately (unlike a
 * Checkbox, which is usually part of a form submitted later).
 *
 * It's a native checkbox with role="switch" (WAI-ARIA APG switch pattern), so
 * screen readers say "on"/"off" and Space toggles it.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
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
  const [isOn, setIsOn] = useControllableState({
    prop: checked,
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
  });

  const autoId = useId();
  const inputId = id ?? autoId;
  const descriptionId = description ? `${inputId}-description` : undefined;

  return (
    <div className={cx(choice.root, className)} style={style} data-disabled={disabled ? "" : undefined}>
      <span className={styles.wrap}>
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          id={inputId}
          className={styles.input}
          checked={isOn}
          onChange={(event) => setIsOn(event.currentTarget.checked)}
          disabled={disabled}
          aria-describedby={[descriptionId, describedByProp].filter(Boolean).join(" ") || undefined}
          {...rest}
        />
        <span className={styles.track} aria-hidden>
          <span className={styles.thumb} />
        </span>
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
