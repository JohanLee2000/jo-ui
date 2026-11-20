// Builds design tokens into CSS custom properties, plus JSON for tooling.
//
// Output (dist/):
//   css/base.css   theme-independent tokens: space, radius, font, motion
//   css/light.css  semantic colors for the light theme (also the default)
//   css/dark.css   semantic colors for the dark theme
//   css/system.css dark colors inside @media (prefers-color-scheme: dark), so
//                  "system" follows the OS before any JavaScript runs
//   json/*.json   the same tokens as flat { "name": "value" } maps, used by
//                  the Storybook Foundations pages to list every token
//   vars.json      every token a component may use, nested by path, with the
//                  CSS variable name as each value. @jo-ui/ui turns this into
//                  a typed `vars` object (vars.color.text.accent → var(--...))
//
// Run with: pnpm --filter @jo-ui/tokens build

import { readFile, writeFile } from "node:fs/promises";

import StyleDictionary from "style-dictionary";

const PRIMITIVES = "src/primitive/*.json";
const BUILD_PATH = "dist/";

// A custom output format: a nested object following each token's path, with
// its CSS variable name as the value. Using token.path (not splitting the name
// on "-") keeps multi-word keys intact: font.line-height.tight stays three
// levels, not four.
StyleDictionary.registerFormat({
  name: "json/css-var-names",
  format: ({ dictionary }) => {
    const tree = {};
    for (const token of dictionary.allTokens) {
      let node = tree;
      for (const key of token.path.slice(0, -1)) {
        node = node[key] ??= {};
      }
      node[token.path.at(-1)] = token.name; // e.g. "font-line-height-tight"
    }
    return `${JSON.stringify(tree, null, 2)}\n`;
  },
});

// Which CSS selector each theme's variables are scoped to.
// Light also applies to :root, so it's the default when no data-theme is set,
// and to "system", which system.css switches to dark when the OS prefers it.
const themes = {
  light: ':root, [data-theme="light"], [data-theme="system"]',
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

// 3. vars.json: the names components may use. Same token set as the CSS files:
//    semantic colors (the light theme's names; every theme has the same ones)
//    plus the base tokens, but never raw color primitives.
//    Written to dist/ rather than dist/json/, which holds only token values
//    (the contrast check treats every json/ file except base.json as a theme).
const contract = new StyleDictionary({
  include: [PRIMITIVES],
  source: ["src/themes/light.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: BUILD_PATH,
      files: [
        {
          destination: "vars.json",
          format: "json/css-var-names",
          filter: (token) => token.isSource || token.path[0] !== "color",
        },
      ],
    },
  },
});
await contract.buildAllPlatforms();

// 4. system.css: the dark variables again, but only when the OS prefers dark
//    and no explicit theme was chosen. Style Dictionary can't wrap output in a
//    media query, so we copy the variables out of the generated dark.css.
//    Must be loaded after light.css: both match [data-theme="system"], and the
//    later rule wins.
const darkCss = await readFile(`${BUILD_PATH}css/dark.css`, "utf8");
const darkVariables = darkCss.slice(darkCss.indexOf("{") + 1, darkCss.lastIndexOf("}")).trim();

await writeFile(
  `${BUILD_PATH}css/system.css`,
  `/**
 * Do not edit directly, this file was auto-generated.
 */

@media (prefers-color-scheme: dark) {
  :root:not([data-theme]),
  [data-theme="system"] {
    ${darkVariables.replace(/\n\s*/g, "\n    ")}
  }
}
`,
);
console.log(`✔︎ ${BUILD_PATH}css/system.css`);
