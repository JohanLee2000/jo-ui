import { forwardRef } from "react";

import { cx } from "@jo-ui/ui-core";

import { Box, type BoxProps } from "./Box";
import { container, type ContainerVariants } from "./Container.css";

export interface ContainerProps extends BoxProps, ContainerVariants {}

/**
 * Centers page content with a max width and comfortable side padding
 * (larger from the md breakpoint up). Usually one per page section.
 *
 *   <Container size="md" as="main">...</Container>
 */
export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  { size, className, ...rest },
  ref,
) {
  return <Box ref={ref} className={cx(container({ size }), className)} {...rest} />;
});
