import { useCallback, useState, type SetStateAction } from "react";

export interface UseControllableStateOptions<T> {
  /** The controlled value. When defined, the parent owns the state. */
  prop?: T | undefined;
  /** Starting value when uncontrolled (no `prop`). */
  defaultProp: T;
  /** Called with the new value whenever it changes, in either mode. */
  onChange?: ((value: T) => void) | undefined;
}

/**
 * State that works both controlled and uncontrolled, the way native inputs do:
 *
 *   <Checkbox checked={value} onCheckedChange={setValue} />  // controlled: parent owns it
 *   <Checkbox defaultChecked />                               // uncontrolled: component owns it
 *
 * Inside the component, use it like useState:
 *
 *   const [checked, setChecked] = useControllableState({
 *     prop: props.checked,
 *     defaultProp: props.defaultChecked ?? false,
 *     onChange: props.onCheckedChange,
 *   });
 *
 * Controlled: setChecked only calls onChange; the value updates when the
 * parent passes a new `checked`. Uncontrolled: it updates its own state and
 * also calls onChange, so the parent can still listen.
 *
 * T can't itself be a function, because functions are treated as updaters.
 */
export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateOptions<T>): [T, (next: SetStateAction<T>) => void] {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledValue;

  const setValue = useCallback(
    (next: SetStateAction<T>) => {
      const nextValue = typeof next === "function" ? (next as (previous: T) => T)(value) : next;
      if (Object.is(nextValue, value)) return; // no change, no onChange

      if (!isControlled) setUncontrolledValue(nextValue);
      onChange?.(nextValue);
    },
    [isControlled, value, onChange],
  );

  return [value, setValue];
}
