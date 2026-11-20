// Builds design tokens into CSS custom properties, plus JSON for tooling.
//
// Output (dist/):
//   css/base.css   theme-independent tokens: space, radius, font, motion
//   css/light.css  semantic colors for the light theme (also the default)
//   css/dark.css   semantic colors for the dark theme
//   json/*.json    the same tokens as flat { "name": "value" } maps, used by
//                  the Storybook Foundations pages to list every token
//
// Run with: pnpm --filter @jo-ui/tokens build

import StyleDictionary from "style-dictionary";

const PRIMITIVES = "src/primitive/*.json";
const BUILD_PATH = "dist/";

// Which CSS selector each theme's variables are scoped to.
// Light also applies to :root, so it's the default when no data-theme is set.
const themes = {
  light: ':root, [data-theme="light"]',
  dark: '[data-theme="dark"]',
};

// 1. Base tokens: the same in every theme, so they're written once.
//    Raw color primitives are excluded so components can't reach for
//    color.blue.600 directly; they must go through a semantic token.
const base = new StyleDictionary({
  source: [PRIMITIVES],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: BUILD_PATH,
      files: [
        {
          destination: "css/base.css",
          format: "css/variables",
          filter: (token) => token.path[0] !== "color",
          options: { selector: ":root" },
        },
        {
          destination: "json/base.json",
          format: "json/flat",
          filter: (token) => token.path[0] !== "color",
        },
      ],
    },
  },
});
await base.cleanAllPlatforms();
await base.buildAllPlatforms();

// 2. One file per theme.
//    Primitives go in `include`: they're loaded so references like
//    {color.blue.600} resolve, but are marked isSource: false.
//    The theme file goes in `source`, and the filter keeps only those tokens.
for (const [theme, selector] of Object.entries(themes)) {
  const sd = new StyleDictionary({
    include: [PRIMITIVES],
    source: [`src/themes/${theme}.json`],
    platforms: {
      css: {
        transformGroup: "css",
        buildPath: BUILD_PATH,
        files: [
          {
            destination: `css/${theme}.css`,
            format: "css/variables",
            filter: (token) => token.isSource,
            options: { selector },
          },
          {
            destination: `json/${theme}.json`,
            format: "json/flat",
            filter: (token) => token.isSource,
          },
        ],
      },
    },
  });

  await sd.buildAllPlatforms();
}
