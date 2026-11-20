import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { VisuallyHidden } from "./VisuallyHidden";

const meta = {
  title: "Utilities/VisuallyHidden",
  component: VisuallyHidden,
  tags: ["autodocs"],
} satisfies Meta<typeof VisuallyHidden>;

export default meta;

/**
 * The button shows only "×", but screen readers announce "Close dialog".
 * The hidden text gives it an accessible name.
 */
export const IconButtonLabel: StoryObj<typeof meta> = {
  render: () => (
    <button type="button">
      <span aria-hidden>×</span>
      <VisuallyHidden>Close dialog</VisuallyHidden>
    </button>
  ),
  play: async ({ canvas }) => {
    // Found by its accessible name, even though the text isn't visible.
    const button = canvas.getByRole("button", { name: "Close dialog" });
    const hidden = canvas.getByText("Close dialog");

    await expect(button).toBeInTheDocument();
    await expect(hidden.getBoundingClientRect().width).toBeLessThanOrEqual(1);
  },
};
