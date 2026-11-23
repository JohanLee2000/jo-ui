import { forwardRef, type ComponentPropsWithoutRef, type MouseEvent } from "react";

import { cx, Slot } from "@jo-ui/ui-core";
import { LoaderIcon } from "@jo-ui/ui-icons";

import { button, spinner, type ButtonVariants } from "./Button.css";

export interface ButtonProps extends ComponentPropsWithoutRef<"button">, ButtonVariants {
  /**
   * Shows a busy state: blocks clicks and sets `aria-busy`, while keeping the
   * label (and so the button's width) in place.
   */
  loading?: boolean;
  /**
   * Render the single child element instead of a `<button>`, with Button's
   * styles and props merged onto it. Use it for links that should look like
   * buttons:
   *
   *   <Button asChild><a href="/signup">Sign up</a></Button>
   *   <Button asChild><Link href="/signup">Sign up</Link></Button>  // Next.js
   */
  asChild?: boolean;
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
    asChild = false,
    // A plain <button> inside a <form> defaults to "submit", so a "Cancel"
    // button would submit the form. Defaulting to "button" prevents that;
    // pass type="submit" explicitly when you want it.
    type = "button",
    className,
    onClick,
    children,
    ...rest
  },
  ref,
) {
  const isInactive = disabled || loading;
  const classes = cx(button({ size, variant, tone }), className);

  if (asChild) {
    // The child might be a link, which has no `disabled` or `type`.
    // Disabled is expressed with aria-disabled instead, and clicks are
    // blocked so the link doesn't navigate.
    return (
      <Slot
        ref={ref}
        className={classes}
        aria-disabled={isInactive || undefined}
        aria-busy={loading || undefined}
        data-loading={loading ? "" : undefined}
        onClick={(event: MouseEvent<HTMLElement>) => {
          // Like a disabled <button>: no navigation and no onClick.
          if (isInactive) {
            event.preventDefault();
            return;
          }
          onClick?.(event as MouseEvent<HTMLButtonElement>);
        }}
        {...(rest as ComponentPropsWithoutRef<typeof Slot>)}
      >
        {children}
      </Slot>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      // Loading also disables, so it can't be clicked twice.
      disabled={isInactive}
      aria-busy={loading || undefined}
      data-loading={loading ? "" : undefined}
      // Our classes first, then the user's: merged, never replaced.
      className={classes}
      onClick={onClick}
      {...rest}
    >
      {/* Decorative: aria-busy is what tells screen readers it's working. */}
      {loading && <LoaderIcon className={spinner} />}
      {children}
    </button>
  );
});
