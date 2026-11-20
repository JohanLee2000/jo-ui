import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import tokens from "@jo-ui/tokens/json/base.json";

import { vars } from "../theme/vars.css";

export const container = recipe({
  base: {
    boxSizing: "border-box",
    width: "100%",
    marginInline: "auto", // centers it; the one place a layout component sets margin
    paddingInline: vars.space[4],
    "@media": {
      [`screen and (min-width: ${tokens["breakpoint-md"]})`]: {
        paddingInline: vars.space[6],
      },
    },
  },
  variants: {
    // Max widths match the breakpoints, so content lines up with layout changes.
    size: {
      sm: { maxWidth: tokens["breakpoint-sm"] },
      md: { maxWidth: tokens["breakpoint-md"] },
      lg: { maxWidth: tokens["breakpoint-lg"] },
      xl: { maxWidth: tokens["breakpoint-xl"] },
      full: { maxWidth: "none" },
    },
  },
  defaultVariants: { size: "lg" },
});

export type ContainerVariants = NonNullable<RecipeVariants<typeof container>>;
