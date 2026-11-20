import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useMemo,
  version,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cx } from "../utils/cx";
import { mergeRefs } from "../utils/mergeRefs";

export interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

/**
 * Renders its single child, with the Slot's props merged onto it.
 * This powers the `asChild` pattern:
 *
 *   <Button asChild><a href="/docs">Docs</a></Button>
 *   → <a href="/docs" class="button-classes">Docs</a>
 *
 * The component keeps its styling and behavior; the user picks the element.
 * Merging rules: classNames are joined, styles are combined, event handlers
 * both run (child's first), refs are merged, and for anything else the
 * child's own prop wins.
 */
export const Slot = forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  forwardedRef,
) {
  // Exactly one element child, or this throws a clear error.
  const child = Children.only(children);
  if (!isValidElement(child)) {
    throw new Error("Slot (asChild) expects a single React element as its child, not text.");
  }

  const childProps = child.props as Record<string, unknown>;
  const childRef = getElementRef(child);
  const ref = useMemo(() => mergeRefs(forwardedRef, childRef), [forwardedRef, childRef]);

  return cloneElement(child, { ...mergeProps(slotProps, childProps), ref } as Record<string, unknown>);
});

type AnyHandler = (...args: unknown[]) => unknown;

function mergeProps(slotProps: Record<string, unknown>, childProps: Record<string, unknown>) {
  // Start with the slot's props, then let the child's override them.
  const merged: Record<string, unknown> = { ...slotProps, ...childProps };

  for (const key of Object.keys(slotProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    // Event handlers (onClick, onKeyDown, ...): run both.
    if (/^on[A-Z]/.test(key) && typeof slotValue === "function" && typeof childValue === "function") {
      merged[key] = (...args: unknown[]) => {
        (childValue as AnyHandler)(...args);
        (slotValue as AnyHandler)(...args);
      };
    } else if (key === "className") {
      merged[key] = cx(slotValue as string | undefined, childValue as string | undefined);
    } else if (key === "style") {
      merged[key] = { ...(slotValue as CSSProperties), ...(childValue as CSSProperties) };
    }
  }

  return merged;
}

// React 19 made `ref` a regular prop; React 18 keeps it on the element.
// Reading element.ref in React 19 logs a warning, so check the version.
const refIsProp = Number.parseInt(version, 10) >= 19;

function getElementRef(element: ReactElement): Ref<unknown> | undefined {
  if (refIsProp) {
    return (element.props as { ref?: Ref<unknown> }).ref;
  }
  return (element as unknown as { ref?: Ref<unknown> }).ref;
}
