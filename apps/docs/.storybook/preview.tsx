import type { Decorator, Preview } from "@storybook/react-vite";

// Design tokens: theme-independent values, then one file per theme.
// Light is scoped to :root as well, so it applies when no theme is set.
import "@jo-ui/tokens/css/base.css";
import "@jo-ui/tokens/css/light.css";
import "@jo-ui/tokens/css/dark.css";
import "./preview.css";

// Applies the toolbar's theme choice the same way a real app would:
// by setting data-theme on <html>. The token CSS does the rest.
const withTheme: Decorator = (Story, context) => {
  document.documentElement.dataset.theme = context.globals.theme;
  return <Story />;
};

const preview: Preview = {
  // A "Theme" dropdown in the Storybook toolbar.
  globalTypes: {
    theme: {
      description: "Color theme",
      toolbar: {
        title: "Theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [withTheme],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
