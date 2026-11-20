import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Grid } from "./Grid";
import { isAtLeast, Tile } from "./storyHelpers";

const meta = {
  title: "Layout/Grid",
  component: Grid,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

const tiles = Array.from({ length: 6 }, (_, i) => <Tile key={i}>Item {i + 1}</Tile>);

/** 1 column on phones, 2 from sm (640px), 3 from lg (1024px). */
export const Responsive: Story = {
  args: {
    columns: { base: 1, sm: 2, lg: 3 },
    gap: 4,
    children: tiles,
    "aria-label": "grid",
  },
  play: async ({ canvas }) => {
    const style = getComputedStyle(canvas.getByLabelText("grid"));
    const expected = isAtLeast("1024px") ? 3 : isAtLeast("640px") ? 2 : 1;

    // The browser reports resolved track sizes, e.g. "300px 300px 300px".
    await expect(style.gridTemplateColumns.split(" ")).toHaveLength(expected);
    await expect(style.columnGap).toBe("16px"); // space-4
  },
};

export const FourColumns: Story = {
  args: { columns: 4, gap: 2, children: tiles },
};
