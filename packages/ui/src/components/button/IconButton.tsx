import { forwardRef, type ReactElement } from "react";

import { cx } from "@jo-ui/ui-core";

import { Button, type ButtonProps } from "./Button";
import { iconOnly } from "./Button.css";

export interface IconButtonProps extends Omit<ButtonProps, "children" | "asChild"> {
  /**
   * Required: an icon has no text, so this is the button's only name for
   * screen readers ("Close", "Delete", "Search"). TypeScript won't let you
   * forget it.
   */
  "aria-label": string;
  /** One icon from @jo-ui/ui-icons (or any svg). */
  children: ReactElement;
}

/**
 * A square button with just an icon. Ghost by default, the usual style for
 * toolbar and dialog-close buttons.
 *
 *   <IconButton aria-label="Close"><XIcon /></IconButton>
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = "ghost", className, ...rest },
  ref,
) {
  return <Button ref={ref} variant={variant} className={cx(iconOnly, className)} {...rest} />;
});
