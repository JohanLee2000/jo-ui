import { forwardRef } from "react";

import { cx } from "@jo-ui/ui-core";

import { Box, type BoxProps } from "../layout/Box";
import type { Sprinkles } from "../layout/sprinkles.css";
import * as styles from "./Typography.css";

type TypographyStyleProps = "fontSize" | "fontWeight" | "fontFamily" | "color" | "textAlign";

export interface TextProps extends Omit<BoxProps, TypographyStyleProps> {
  /** Font size token. Responsive: size={{ base: "sm", md: "md" }}. Default "md". */
  size?: Sprinkles["fontSize"];
  /** Default "regular". */
  weight?: Sprinkles["fontWeight"];
  /** Text color token. Leave unset to inherit from the parent (usually what you want). */
  tone?: Sprinkles["color"];
  /** "sans" (default) or "mono". */
  family?: Sprinkles["fontFamily"];
  align?: Sprinkles["textAlign"];
  /** Keep to one line and cut off with "…". Give the element a width to cut against. */
  truncate?: boolean;
}

/**
 * Body text. Renders a <p> by default; use `as` for others (span, label, strong...).
 *
 *   <Text tone="muted" size="sm">Last updated 2 days ago</Text>
 */
export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as = "p", size = "md", weight = "regular", tone, family, align, truncate = false, className, ...rest },
  ref,
) {
  return (
    <Box
      ref={ref}
      as={as}
      fontSize={size}
      fontWeight={weight}
      color={tone}
      fontFamily={family}
      textAlign={align}
      className={cx(styles.text, truncate && styles.truncate, className)}
      {...rest}
    />
  );
});
