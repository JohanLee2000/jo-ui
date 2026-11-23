import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType } from "react";
import { expect } from "storybook/test";

import * as everything from "./index";
import type { IconProps } from "./createIcon";

// Icon components are the PascalCase exports ending in "Icon". (A plain
// endsWith("Icon") would also match the createIcon helper.)
const icons = Object.entries(everything).filter(([name]) => /^[A-Z]\w*Icon$/.test(name)) as Array<
  [string, ComponentType<IconProps>]
>;

const meta = {
  title: "Icons/Gallery",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

/** Every icon. They inherit the text color and size from wherever they're placed. */
export const All: StoryObj = {
  render: () => (
    <ul
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(9rem, 1fr))",
        gap: "var(--space-3)",
        margin: 0,
        padding: 0,
        listStyle: "none",
      }}
    >
      {icons.map(([name, Icon]) => (
        <li
          key={name}
          style={{
            display: "grid",
            justifyItems: "center",
            gap: "var(--space-2)",
            padding: "var(--space-4)",
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border-default)",
            borderRadius: "var(--radius-md)",
            fontSize: "var(--font-size-sm)",
          }}
        >
          <Icon size={24} />
          <code>{name}</code>
        </li>
      ))}
    </ul>
  ),
  play: async ({ canvasElement }) => {
    const svgs = canvasElement.querySelectorAll("svg");
    await expect(svgs.length).toBe(icons.length);
    // Decorative by default: hidden from screen readers.
    for (const svg of svgs) await expect(svg).toHaveAttribute("aria-hidden", "true");
  },
};

/** Size defaults to 1em, so icons scale with text; color comes from the text color. */
export const InheritsSizeAndColor: StoryObj = {
  render: () => (
    <p style={{ margin: 0, fontSize: "var(--font-size-2xl)", color: "var(--color-text-danger)" }}>
      <everything.AlertTriangleIcon /> Something went wrong
    </p>
  ),
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector("svg")!;
    const text = canvasElement.querySelector("p")!;
    await expect(svg.getBoundingClientRect().height).toBe(parseFloat(getComputedStyle(text).fontSize));
    await expect(getComputedStyle(svg).color).toBe(getComputedStyle(text).color);
  },
};

/** With a `title`, an icon becomes an image with an accessible name, for when it's the only signal. */
export const WithTitle: StoryObj = {
  render: () => <everything.CheckCircleIcon size={32} title="Payment complete" style={{ color: "var(--color-text-success)" }} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("img", { name: "Payment complete" })).toBeInTheDocument();
  },
};
