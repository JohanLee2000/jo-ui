import { forwardRef, type ComponentPropsWithoutRef } from "react";

import { cx } from "../../utils/cx";
import { button, type ButtonVariants } from "./Button.css";

export interface ButtonProps extends ComponentPropsWithoutRef<"button">, ButtonVariants {
  /**
   * Shows a busy state: blocks clicks and sets `aria-busy`, while keeping the
   * label (and so the button's width) in place.
   */
  loading?: boolean;
}

/**
 * A native `<button>`, so keyboard support (Tab, Enter, Space), focus and form
 * behavior come from the browser.
 *
 * - `size`: `sm` | `md` (default) | `lg`
 * - `variant`: `solid` (default) | `outline` | `ghost`
 * - `tone`: `accent` (default) | `danger`
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    size,
    variant,
    tone,
    loading = false,
    disabled = false,
    // A plain <button> inside a <form> defaults to "submit", so a "Cancel"
    // button would submit the form. Defaulting to "button" prevents that;
    // pass type="submit" explicitly when you want it.
    type = "button",
    className,
    children,
    ...rest
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      // Loading also disables, so it can't be clicked twice.
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      data-loading={loading ? "" : undefined}
      // Our classes first, then the user's: merged, never replaced.
      className={cx(button({ size, variant, tone }), className)}
      {...rest}
    >
      {children}
    </button>
  );
});
