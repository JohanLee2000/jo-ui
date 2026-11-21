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

import { cx } from "@jo-ui/ui-core";

import * as styles from "./Field.css";

interface FieldContextValue {
  controlId: string;
  describedBy: string | undefined;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
}

const FieldContext = createContext<FieldContextValue | null>(null);

export interface FieldProps extends Omit<ComponentPropsWithoutRef<"div">, "id"> {
  /** Visible label. Clicking it focuses the control. */
  label: ReactNode;
  /** Help text shown under the control. */
  hint?: ReactNode;
  /** Error message. When set, the control is marked invalid and the message is announced with it. */
  error?: ReactNode;
  /** Marks the control required (screen readers announce it) and shows a "*" after the label. */
  required?: boolean;
  disabled?: boolean;
  /** Id for the control. Generated if omitted. */
  id?: string;
  /** One form control: Input, Textarea... */
  children: ReactNode;
}

/**
 * Connects a label, hint and error message to a form control, so screen
 * readers announce all of them when the control is focused:
 *
 *   <Field label="Email" hint="We'll never share it." error={errors.email} required>
 *     <Input type="email" />
 *   </Field>
 *
 *   → <label for="r1">Email *</label>
 *     <input id="r1" aria-describedby="r1-hint r1-error" aria-invalid="true" required>
 *     <p id="r1-hint">...</p> <p id="r1-error">...</p>
 *
 * The control picks all of that up automatically through context.
 */
export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, hint, error, required = false, disabled = false, id, className, children, ...rest },
  ref,
) {
  // useId gives ids that match between server and client rendering.
  const autoId = useId();
  const controlId = id ?? `${autoId}control`;
  const hintId = hint ? `${controlId}-hint` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const invalid = Boolean(error);

  const value = useMemo<FieldContextValue>(
    () => ({ controlId, describedBy: joinIds(hintId, errorId), invalid, required, disabled }),
    [controlId, hintId, errorId, invalid, required, disabled],
  );

  return (
    <FieldContext.Provider value={value}>
      <div ref={ref} className={cx(styles.field, className)} data-disabled={disabled ? "" : undefined} {...rest}>
        <label htmlFor={controlId} className={styles.label}>
          {label}
          {/* aria-hidden: the "*" is visual only; `required` on the control is what's announced. */}
          {required && (
            <span aria-hidden className={styles.requiredMark}>
              {" *"}
            </span>
          )}
        </label>
        {children}
        {hint && (
          <p id={hintId} className={styles.hint}>
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} className={styles.error}>
            {error}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
});

interface FieldControlProps {
  id?: string | undefined;
  "aria-describedby"?: string | undefined;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling" | undefined;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
}

/**
 * For control components: fills in id, aria-describedby, aria-invalid,
 * required and disabled from the surrounding Field. Props passed directly
 * to the control win; describedby ids are combined.
 */
export function useFieldControl<P extends FieldControlProps>(props: P): P {
  const field = useContext(FieldContext);
  if (!field) return props;

  return {
    ...props,
    id: props.id ?? field.controlId,
    "aria-describedby": joinIds(field.describedBy, props["aria-describedby"]),
    "aria-invalid": props["aria-invalid"] ?? (field.invalid || undefined),
    required: props.required ?? (field.required || undefined),
    disabled: props.disabled ?? (field.disabled || undefined),
  };
}

function joinIds(...ids: Array<string | undefined>) {
  return ids.filter(Boolean).join(" ") || undefined;
}
