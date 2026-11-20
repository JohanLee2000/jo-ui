import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Container } from "./Container";
import { Tile } from "./storyHelpers";

const meta = {
  title: "Layout/Container",
  component: Container,
  tags: ["autodocs"],
  // Full width, so the container's own centering and max width are visible.
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default size: lg (1024px max), centered, with side padding. */
export const Default: Story = {
  args: {
    "aria-label": "container",
    children: <Tile>Page content is centered and stops growing at 1024px.</Tile>,
  },
  play: async ({ canvas }) => {
    const style = getComputedStyle(canvas.getByLabelText("container"));
    await expect(style.maxWidth).toBe("1024px");
    await expect(style.marginLeft).toBe(style.marginRight); // centered
  },
};

/** Narrower, for reading content like articles and forms. */
export const Small: Story = {
  args: {
    size: "sm",
    "aria-label": "container",
    children: <Tile>A narrow 640px column suits long-form text.</Tile>,
  },
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByLabelText("container")).maxWidth).toBe("640px");
  },
};
