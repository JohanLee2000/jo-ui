import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Hello } from "./Hello";

// The default export ("meta") describes the component as a whole:
// where it appears in the sidebar, which component it documents, and
// args shared by every story below.
const meta = {
  title: "Placeholders/Hello",
  component: Hello,
  tags: ["autodocs"], // generate a Docs page with a props table
} satisfies Meta<typeof Hello>;

export default meta;
type Story = StoryObj<typeof meta>;

// Each named export is one story: the component in one specific state.
export const Default: Story = {};

export const CustomName: Story = {
  args: {
    name: "Jo",
  },
};

/** A className passed in is added to Hello's own class, not swapped for it. */
export const WithClassName: Story = {
  args: {
    className: "my-app-class",
  },
  play: async ({ canvas }) => {
    const hello = canvas.getByText("Hello, world!");

    await expect(hello).toHaveClass("my-app-class");
    // Hello's own vanilla-extract class is still there...
    await expect(hello.className).toMatch(/Hello_root__/);
    // ...so its styles still apply: accent text color, not the inherited default.
    await expect(getComputedStyle(hello).color).not.toBe(getComputedStyle(document.body).color);
  },
};
