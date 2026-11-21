import { forwardRef } from "react";

import { cx } from "@jo-ui/ui-core";

import { Box, type BoxProps } from "../layout/Box";
import type { Sprinkles } from "../layout/sprinkles.css";
import * as styles from "./Typography.css";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type TypographyStyleProps = "as" | "fontSize" | "fontWeight" | "fontFamily" | "color" | "textAlign";

export interface HeadingProps extends Omit<BoxProps, TypographyStyleProps> {
  /**
   * The heading's place in the page outline: renders <h1>–<h6>. Pick it by
   * structure (an h3 belongs under an h2), never by how big it should look;
   * use `size` for that. Default 2.
   */
  level?: HeadingLevel;
  /** Visual size, independent of level. Responsive. Defaults to a size matching the level. */
  size?: Sprinkles["fontSize"];
  /** Default "semibold". */
  weight?: Sprinkles["fontWeight"];
  /** Text color token. Leave unset to inherit. */
  tone?: Sprinkles["color"];
  align?: Sprinkles["textAlign"];
  /** Keep to one line and cut off with "…". */
  truncate?: boolean;
}

// Used when no `size` is given.
const defaultSizes = {
  1: "4xl",
  2: "3xl",
  3: "2xl",
  4: "xl",
  5: "lg",
  6: "md",
} as const satisfies Record<HeadingLevel, Sprinkles["fontSize"]>;

/**
 * A section heading. `level` sets the meaning, `size` sets the look:
 *
 *   <Heading level={1}>Settings</Heading>
 *   <Heading level={2} size="lg">Notifications</Heading>   // an h2 that looks small
 *   <Heading level={1} size={{ base: "2xl", md: "4xl" }}>Welcome</Heading>
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level = 2, size, weight = "semibold", tone, align, truncate = false, className, ...rest },
  ref,
) {
  return (
    <Box
      ref={ref}
      as={`h${level}`}
      fontSize={size ?? defaultSizes[level]}
      fontWeight={weight}
      color={tone}
      textAlign={align}
      className={cx(styles.heading, truncate && styles.truncate, className)}
      {...rest}
    />
  );
});
