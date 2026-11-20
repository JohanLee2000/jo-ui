import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Button } from "../components/button";
import { Inline, Stack } from "./Stack";
import { isAtLeast, Tile } from "./storyHelpers";

const meta = {
  title: "Layout/Stack",
  component: Stack,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

const tiles = ["One", "Two", "Three"].map((label) => <Tile key={label}>{label}</Tile>);

/** Vertical by default, with an even gap between children. */
export const Vertical: Story = {
  args: { gap: 3, children: tiles, "aria-label": "stack" },
  play: async ({ canvas }) => {
    const style = getComputedStyle(canvas.getByLabelText("stack"));
    await expect(style.flexDirection).toBe("column");
    await expect(style.rowGap).toBe("12px"); // space-3
  },
};

/** A column on small screens, a row from md (768px) up. Resize the canvas to see it switch. */
export const Responsive: Story = {
  args: {
    direction: { base: "column", md: "row" },
    gap: { base: 2, md: 6 },
    children: tiles,
    "aria-label": "stack",
  },
  play: async ({ canvas }) => {
    const style = getComputedStyle(canvas.getByLabelText("stack"));
    const wide = isAtLeast("768px");
    await expect(style.flexDirection).toBe(wide ? "row" : "column");
    await expect(style.rowGap).toBe(wide ? "24px" : "8px");
  },
};

/** Inline: a wrapping row, vertically centered. Made for groups of buttons or tags. */
export const InlineButtons: Story = {
  name: "Inline",
  render: () => (
    <Inline gap={2} aria-label="actions">
      <Button>Save</Button>
      <Button variant="outline">Preview</Button>
      <Button variant="ghost" tone="danger">
        Discard
      </Button>
    </Inline>
  ),
  play: async ({ canvas }) => {
    const style = getComputedStyle(canvas.getByLabelText("actions"));
    await expect(style.flexDirection).toBe("row");
    await expect(style.flexWrap).toBe("wrap");
    await expect(style.alignItems).toBe("center");
  },
};
