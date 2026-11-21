import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Inline } from "../../layout/Stack";
import { Stack } from "../../layout/Stack";
import { Button } from "../button/Button";
import { Input } from "./Input";

const meta = {
  title: "Forms/Input",
  component: Input,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  // Inputs need a label to be accessible; in apps, wrap them in a Field.
  args: { "aria-label": "Search", placeholder: "Search…" },
  decorators: [(Story) => <div style={{ maxWidth: "24rem" }}>{Story()}</div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Stack gap={3}>
      <Input {...args} size="sm" aria-label="Small" placeholder="Small" />
      <Input {...args} size="md" aria-label="Medium" placeholder="Medium" />
      <Input {...args} size="lg" aria-label="Large" placeholder="Large" />
    </Stack>
  ),
};

/** Heights match Button's, so they line up in a row. */
export const WithButton: Story = {
  render: (args) => (
    <Inline gap={2} wrap="nowrap">
      <Input {...args} />
      <Button>Search</Button>
    </Inline>
  ),
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox");
    const button = canvas.getByRole("button");
    await expect(input.getBoundingClientRect().height).toBe(button.getBoundingClientRect().height);
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Read-only value" },
};
