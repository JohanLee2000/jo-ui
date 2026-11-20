import { createGlobalThemeContract } from "@vanilla-extract/css";

import tokenNames from "@jo-ui/tokens/vars.json";

/**
 * Typed access to every design token, for use in .css.ts files:
 *
 *   vars.color.text.accent  →  "var(--color-text-accent)"
 *   vars.space[4]           →  "var(--space-4)"
 *   vars.color.txt.accent   →  TypeScript error
 *
 * This creates no CSS. The variables are defined by @jo-ui/tokens' CSS files;
 * this only adds types on top, so a typo fails the build instead of silently
 * rendering the wrong color.
 */
export const vars = createGlobalThemeContract(
  tokenNames,
  // Each value in vars.json is already the variable name, e.g. "color-text-accent".
  (variableName) => variableName ?? "",
);
