import { forwardRef, type ElementType, type HTMLAttributes } from "react";

import { cx } from "@jo-ui/ui-core";

import { sprinkles, type Sprinkles } from "./sprinkles.css";

export interface BoxProps extends Omit<HTMLAttributes<HTMLElement>, keyof Sprinkles>, Sprinkles {
  /** The element to render. Pick the one that fits the content: section, nav, ul, article... */
  as?: ElementType;
}

/**
 * The base layout primitive: an element that accepts token-based style props,
 * each optionally responsive.
 *
 *   <Box as="section" padding={{ base: 4, md: 8 }} background="surface" borderRadius="lg">
 *
 * Stack, Inline and Grid are Boxes with sensible defaults.
 */
export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  { as: Component = "div", className, ...props },
  ref,
) {
  // Split style props (handled by sprinkles) from everything else
  // (passed through to the element: id, aria-*, onClick, children...).
  const styleProps: Record<string, unknown> = {};
  const elementProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if (sprinkles.properties.has(key as keyof Sprinkles)) {
      styleProps[key] = value;
    } else {
      elementProps[key] = value;
    }
  }

  return <Component ref={ref} className={cx(sprinkles(styleProps as Sprinkles), className)} {...elementProps} />;
});
