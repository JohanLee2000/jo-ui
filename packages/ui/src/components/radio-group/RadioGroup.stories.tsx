import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { Radio, RadioGroup } from "./RadioGroup";

const meta = {
  title: "Forms/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    label: "Plan",
    onValueChange: fn(),
    children: [
      <Radio key="free" value="free" description="Up to 3 projects">
        Free
      </Radio>,
      <Radio key="pro" value="pro" description="$8 per month">
        Pro
      </Radio>,
      <Radio key="team" value="team" description="$20 per seat per month">
        Team
      </Radio>,
    ],
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tab enters the group once; arrow keys move and select (native radio behavior). */
export const Keyboard: Story = {
  args: { defaultValue: "free" },
  play: async ({ canvas, userEvent, args }) => {
    // The fieldset is a "group", named by its legend.
    await expect(canvas.getByRole("group", { name: "Plan" })).toBeInTheDocument();

    const free = canvas.getByRole("radio", { name: "Free" });
    const pro = canvas.getByRole("radio", { name: "Pro" });

    await userEvent.tab();
    await expect(free).toHaveFocus();

    await userEvent.keyboard("{ArrowDown}");
    await expect(pro).toHaveFocus();
    await expect(pro).toBeChecked();
    await expect(args.onValueChange).toHaveBeenLastCalledWith("pro");

    // One Tab leaves the whole group: radios are a single tab stop.
    await userEvent.tab();
    await expect(canvas.queryAllByRole("radio").some((radio) => radio === document.activeElement)).toBe(false);
  },
};

export const WithError: Story = {
  args: {
    required: true,
    hint: "You can change plans at any time.",
    error: "Choose a plan to continue.",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("group", { name: "Plan" })).toHaveAccessibleDescription(
      "You can change plans at any time. Choose a plan to continue.",
    );
    await expect(canvas.getByRole("radio", { name: "Free" })).toBeInvalid();
  },
};

export const Horizontal: Story = {
  args: {
    label: "Size",
    orientation: "horizontal",
    defaultValue: "m",
    children: ["s", "m", "l", "xl"].map((size) => (
      <Radio key={size} value={size}>
        {size.toUpperCase()}
      </Radio>
    )),
  },
};

/** A disabled option is skipped by arrow keys and can't be selected. */
export const DisabledOption: Story = {
  args: {
    defaultValue: "free",
    children: [
      <Radio key="free" value="free">
        Free
      </Radio>,
      <Radio key="pro" value="pro" disabled description="Sold out">
        Pro
      </Radio>,
      <Radio key="team" value="team">
        Team
      </Radio>,
    ],
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("radio", { name: "Team" })).toBeChecked();
    await expect(canvas.getByRole("radio", { name: "Pro" })).not.toBeChecked();
  },
};
