import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties, ReactNode } from "react";
import { expect } from "storybook/test";

import { ThemeProvider, useTheme } from "./ThemeProvider";

const meta = {
  title: "Theme/ThemeProvider",
  component: ThemeProvider,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// A box drawn with semantic tokens, so it changes with whatever theme it's in.
function Panel({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <section aria-label={label} style={panel}>
      <strong>{label}</strong>
      <ThemeReadout />
      {children}
    </section>
  );
}

// Shows what useTheme() returns at this point in the tree.
function ThemeReadout() {
  const { theme, resolvedTheme } = useTheme();
  return (
    <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
      theme: <code>{theme}</code>, resolvedTheme: <code>{resolvedTheme}</code>
    </p>
  );
}

/** Change the `theme` control to switch the whole area. */
export const Basic: Story = {
  args: {
    theme: "light",
    children: <Panel label="Themed area" />,
  },
};

/** A dark panel inside a light area: the closest provider wins. */
export const Nested: Story = {
  args: {
    theme: "light",
    children: (
      <Panel label="Light area">
        <ThemeProvider theme="dark">
          <Panel label="Dark panel" />
        </ThemeProvider>
      </Panel>
    ),
  },
  // Interaction test: runs in the browser via the Vitest addon.
  play: async ({ canvas }) => {
    const lightArea = canvas.getByRole("region", { name: "Light area" });
    const darkPanel = canvas.getByRole("region", { name: "Dark panel" });

    // Each panel sits inside the provider that set its theme.
    await expect(lightArea.closest("[data-theme]")).toHaveAttribute("data-theme", "light");
    await expect(darkPanel.closest("[data-theme]")).toHaveAttribute("data-theme", "dark");

    // useTheme() reads the nearest provider, so each panel reports its own theme.
    await expect(darkPanel).toHaveTextContent("resolvedTheme: dark");
    await expect(lightArea).toHaveTextContent("resolvedTheme: light");

    // And the CSS actually changed: the dark panel's background is the dark surface token.
    await expect(getComputedStyle(darkPanel).backgroundColor).toBe("rgb(23, 23, 23)");
  },
};

/** "system" follows your OS setting. Switch Windows/macOS to dark mode to see it change. */
export const System: Story = {
  args: {
    theme: "system",
    children: <Panel label="Follows the OS" />,
  },
};

const panel: CSSProperties = {
  display: "grid",
  gap: "var(--space-3)",
  padding: "var(--space-6)",
  background: "var(--color-bg-surface)",
  color: "var(--color-text-primary)",
  border: "1px solid var(--color-border-default)",
  borderRadius: "var(--radius-lg)",
};
