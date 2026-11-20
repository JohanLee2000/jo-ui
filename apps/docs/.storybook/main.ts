import type { StorybookConfig } from "@storybook/react-vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

const config: StorybookConfig = {
  // Stories live next to their components in the library packages.
  // Paths are relative to this .storybook folder.
  // Add "../../../packages/*/src/**/*.mdx" here once you write MDX docs pages.
  stories: [
    "../src/**/*.stories.@(ts|tsx)", // docs-only pages (Foundations)
    "../../../packages/*/src/**/*.stories.@(ts|tsx)", // component stories
  ],
  addons: [
    "@storybook/addon-docs", // auto-generated docs pages + props tables
    "@storybook/addon-a11y", // axe accessibility checks per story
    "@storybook/addon-vitest", // run stories as tests (Vitest browser mode)
  ],
  framework: "@storybook/react-vite",

  // Storybook builds with Vite. This hook receives Storybook's Vite config and
  // returns it with our additions; mergeConfig combines the two instead of
  // replacing Storybook's own plugins.
  viteFinal: async (config) => {
    const { mergeConfig } = await import("vite");
    return mergeConfig(config, {
      // Compiles *.css.ts files (vanilla-extract) into static CSS + class names.
      plugins: [vanillaExtractPlugin()],
    });
  },
};

export default config;
