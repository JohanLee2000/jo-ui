import { forwardRef } from "react";

import { Box, type BoxProps } from "./Box";
import type { Sprinkles } from "./sprinkles.css";

export interface GridProps extends Omit<BoxProps, "display" | "gridTemplateColumns"> {
  /** Number of equal-width columns, 1–12. Responsive: columns={{ base: 1, sm: 2, lg: 4 }}. */
  columns?: Sprinkles["gridTemplateColumns"];
}

/**
 * Equal-width columns that reflow at breakpoints.
 *
 *   <Grid columns={{ base: 1, sm: 2, lg: 3 }} gap={4}>{cards}</Grid>
 */
export const Grid = forwardRef<HTMLElement, GridProps>(function Grid({ columns = 1, ...rest }, ref) {
  return <Box ref={ref} display="grid" gridTemplateColumns={columns} {...rest} />;
});
