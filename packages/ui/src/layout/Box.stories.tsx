import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Box } from "./Box";

const meta = {
  title: "Layout/Box",
  component: Box,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Style props come from tokens; `padding` grows from 4 (16px) to 8 (32px) at the md breakpoint. */
export const Basic: Story = {
  args: {
    as: "section",
    padding: { base: 4, md: 8 },
    background: "surface",
    borderRadius: "lg",
    "aria-label": "Example box",
    children: "A section with responsive padding, a surface background and large rounded corners.",
  },
  play: async ({ canvas }) => {
    const box = canvas.getByRole("region", { name: "Example box" });
    const style = getComputedStyle(box);

    await expect(box.tagName).toBe("SECTION"); // `as` sets the element
    await expect(style.borderTopLeftRadius).toBe("12px"); // radius-lg
    await expect(style.paddingTop).toBe(window.innerWidth >= 768 ? "32px" : "16px");

    // Style props become classes, not HTML attributes on the element.
    await expect(box).not.toHaveAttribute("padding");
    await expect(box).not.toHaveAttribute("background");
  },
};
