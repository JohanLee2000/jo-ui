import { useCallback, type Ref, type RefCallback } from "react";

type PossibleRef<T> = Ref<T> | undefined;

/** Sets a ref of either kind: a callback ref is called, an object ref gets `.current`. */
export function setRef<T>(ref: PossibleRef<T>, value: T | null): void {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref != null) {
    (ref as { current: T | null }).current = value;
  }
}

/**
 * Combines several refs into one, so the same element can be handed to
 * all of them. Needed when a component uses a ref internally (e.g. to focus
 * an element) and also forwards the user's ref:
 *
 *   <button ref={mergeRefs(internalRef, forwardedRef)} />
 */
export function mergeRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  return (node) => {
    for (const ref of refs) setRef(ref, node);
  };
}

/**
 * mergeRefs, but the merged ref keeps the same identity between renders.
 * React detaches and reattaches a ref whenever it changes, so a new function
 * every render would call every ref with `null` and then the element again.
 */
export function useMergedRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  // The refs themselves are the dependencies; their count never changes for
  // a given call site, so spreading them is safe here.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(mergeRefs(...refs), refs);
}
