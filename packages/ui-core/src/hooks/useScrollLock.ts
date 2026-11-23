import { useEffect } from "react";

// How many components currently want the page locked. Counting lets two
// overlays (a dialog opening another) share one lock: the page only unlocks
// when the last one closes.
let lockCount = 0;
let saved: { overflow: string; paddingRight: string } | null = null;

/**
 * Stops the page behind an overlay from scrolling while `enabled` is true.
 *
 * Native modal <dialog> makes the page inert (no clicks, no focus) but you
 * can still scroll it with the wheel or touch, which feels broken. This
 * hides overflow on <html>, and pads the right edge by the scrollbar's width
 * so the page doesn't jump sideways when the scrollbar disappears.
 */
export function useScrollLock(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    if (lockCount === 0) {
      const scrollbarWidth = window.innerWidth - root.clientWidth;
      saved = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
      root.style.overflow = "hidden";
      if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`;
    }
    lockCount++;

    return () => {
      lockCount--;
      if (lockCount === 0 && saved) {
        root.style.overflow = saved.overflow;
        root.style.paddingRight = saved.paddingRight;
        saved = null;
      }
    };
  }, [enabled]);
}
