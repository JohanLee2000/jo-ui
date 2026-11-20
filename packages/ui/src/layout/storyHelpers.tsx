// Shared by the layout stories only (not exported from the package).
import type { ReactNode } from "react";

import { Box } from "./Box";

/** A visible placeholder so layouts can be seen. */
export function Tile({ children }: { children: ReactNode }) {
  return (
    <Box padding={4} background="accent-subtle" color="accent" borderRadius="md" textAlign="center">
      {children}
    </Box>
  );
}

/** Whether the viewport is at least this breakpoint's width, for responsive assertions. */
export function isAtLeast(width: string) {
  return window.matchMedia(`(min-width: ${width})`).matches;
}
