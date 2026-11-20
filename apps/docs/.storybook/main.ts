import type { StorybookConfig } from "@storybook/react-vite";

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
};

export default config;
