import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Stack } from "../layout/Stack";
import { Heading } from "./Heading";

const meta = {
  title: "Typography/Heading",
  component: Heading,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { children: "Heading" },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

const levels = [1, 2, 3, 4, 5, 6] as const;

/** Each level renders the matching <h1>–<h6> with a default size. */
export const Levels: Story = {
  render: (args) => (
    <Stack gap={3}>
      {levels.map((level) => (
        <Heading key={level} {...args} level={level}>
          Level {level} heading
        </Heading>
      ))}
    </Stack>
  ),
  play: async ({ canvas }) => {
    for (const level of levels) {
      // Screen readers navigate by heading level, so the element must be right.
      await expect(canvas.getByRole("heading", { level })).toHaveTextContent(`Level ${level} heading`);
    }
    const h1 = getComputedStyle(canvas.getByRole("heading", { level: 1 }));
    await expect(h1.fontSize).toBe("36px"); // font-size-4xl
    await expect(h1.marginTop).toBe("0px"); // no browser heading margin
  },
};

/**
 * Level is meaning, size is looks. This is an h2 (correct for the page
 * outline) that's styled small, e.g. a card title.
 */
export const SizeIndependentOfLevel: Story = {
  args: { level: 2, size: "lg", children: "Notification settings" },
  play: async ({ canvas }) => {
    const heading = canvas.getByRole("heading", { level: 2 });
    await expect(getComputedStyle(heading).fontSize).toBe("18px"); // font-size-lg
  },
};

/** 2xl on phones, 4xl from md (768px) up. */
export const Responsive: Story = {
  args: { level: 1, size: { base: "2xl", md: "4xl" }, children: "A heading that grows with the screen" },
  play: async ({ canvas }) => {
    const heading = canvas.getByRole("heading", { level: 1 });
    const wide = window.matchMedia("(min-width: 768px)").matches;
    await expect(getComputedStyle(heading).fontSize).toBe(wide ? "36px" : "24px");
  },
};
