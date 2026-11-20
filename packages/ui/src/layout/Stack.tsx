import { forwardRef } from "react";

import { Box, type BoxProps } from "./Box";
import type { Sprinkles } from "./sprinkles.css";

type FlexProps = "display" | "flexDirection" | "alignItems" | "justifyContent" | "flexWrap";

export interface StackProps extends Omit<BoxProps, FlexProps> {
  /** Main axis. Responsive: direction={{ base: "column", md: "row" }}. Default "column". */
  direction?: Sprinkles["flexDirection"];
  /** Cross-axis alignment (align-items). */
  align?: Sprinkles["alignItems"];
  /** Main-axis distribution (justify-content). */
  justify?: Sprinkles["justifyContent"];
  /** Whether items wrap onto new lines. */
  wrap?: Sprinkles["flexWrap"];
}

/**
 * Lays children out in a line with even spacing between them: the most common
 * layout there is. Vertical by default.
 *
 *   <Stack gap={{ base: 2, md: 4 }} direction={{ base: "column", md: "row" }}>
 */
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  { direction = "column", align, justify, wrap, ...rest },
  ref,
) {
  return (
    <Box
      ref={ref}
      display="flex"
      flexDirection={direction}
      alignItems={align}
      justifyContent={justify}
      flexWrap={wrap}
      {...rest}
    />
  );
});

export type InlineProps = Omit<StackProps, "direction">;

/**
 * A horizontal Stack that wraps and centers items vertically. Made for rows
 * of small things: buttons, tags, avatars.
 */
export const Inline = forwardRef<HTMLElement, InlineProps>(function Inline(
  { align = "center", wrap = "wrap", ...rest },
  ref,
) {
  return <Stack ref={ref} direction="row" align={align} wrap={wrap} {...rest} />;
});
