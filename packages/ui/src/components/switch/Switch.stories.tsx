import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { Stack } from "../../layout/Stack";
import { Switch } from "./Switch";

const meta = {
  title: "Forms/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { children: "Dark mode", onCheckedChange: fn() },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** role="switch": announced as on/off. Space and clicks (box or label) toggle it. */
export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const toggle = canvas.getByRole("switch", { name: "Dark mode" });
    await expect(toggle).not.toBeChecked();

    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();

    await userEvent.keyboard(" ");
    await expect(toggle).not.toBeChecked();

    await userEvent.click(canvas.getByText("Dark mode"));
    await expect(toggle).toBeChecked();

    await expect(args.onCheckedChange).toHaveBeenCalledTimes(3);
    await expect(args.onCheckedChange).toHaveBeenLastCalledWith(true);
  },
};

export const Settings: Story = {
  render: (args) => (
    <Stack gap={4} style={{ maxWidth: "28rem" }}>
      <Switch {...args} defaultChecked description="Get a notification when someone replies.">
        Reply notifications
      </Switch>
      <Switch {...args} description="Weekly summary of activity.">
        Email digest
      </Switch>
      <Switch {...args} disabled description="Available on the Pro plan.">
        Priority support
      </Switch>
    </Stack>
  ),
};
