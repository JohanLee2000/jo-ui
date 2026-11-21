import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn } from "storybook/test";

import { Stack } from "../../layout/Stack";
import { Checkbox } from "./Checkbox";

const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { children: "Email me about product updates", onCheckedChange: fn() },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Clicking the box, clicking the label and pressing Space all toggle it. */
export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const checkbox = canvas.getByRole("checkbox", { name: "Email me about product updates" });

    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();

    await userEvent.click(canvas.getByText("Email me about product updates"));
    await expect(checkbox).not.toBeChecked();

    await userEvent.keyboard(" "); // still focused from the first click
    await expect(checkbox).toBeChecked();

    await expect(args.onCheckedChange).toHaveBeenNthCalledWith(1, true);
    await expect(args.onCheckedChange).toHaveBeenNthCalledWith(2, false);
  },
};

export const WithDescription: Story = {
  args: {
    children: "Remember this device",
    description: "You won't be asked for a code on this device for 30 days.",
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("checkbox")).toHaveAccessibleDescription(
      "You won't be asked for a code on this device for 30 days.",
    );
  },
};

const items = ["Photos", "Documents", "Music"];

function SelectAllDemo() {
  const [selected, setSelected] = useState<string[]>(["Photos"]);
  const all = selected.length === items.length;
  const none = selected.length === 0;

  return (
    <Stack gap={3}>
      <Checkbox
        checked={all ? true : none ? false : "indeterminate"}
        onCheckedChange={(checked) => setSelected(checked ? items : [])}
      >
        Select all
      </Checkbox>
      <Stack gap={2} paddingLeft={8}>
        {items.map((item) => (
          <Checkbox
            key={item}
            checked={selected.includes(item)}
            onCheckedChange={(checked) =>
              setSelected((current) => (checked ? [...current, item] : current.filter((i) => i !== item)))
            }
          >
            {item}
          </Checkbox>
        ))}
      </Stack>
    </Stack>
  );
}

/** "Select all" is indeterminate (a dash, "mixed" to screen readers) when only some are selected. */
export const Indeterminate: Story = {
  render: () => <SelectAllDemo />,
  play: async ({ canvas, userEvent }) => {
    const selectAll = canvas.getByRole("checkbox", { name: "Select all" });

    await expect(selectAll).toBePartiallyChecked();

    await userEvent.click(selectAll); // indeterminate → all selected
    await expect(selectAll).toBeChecked();
    for (const item of items) {
      await expect(canvas.getByRole("checkbox", { name: item })).toBeChecked();
    }

    await userEvent.click(canvas.getByRole("checkbox", { name: "Music" }));
    await expect(selectAll).toBePartiallyChecked();
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultChecked: true },
  play: async ({ canvas, userEvent, args }) => {
    const checkbox = canvas.getByRole("checkbox");
    await expect(checkbox).toBeDisabled();
    await userEvent.click(canvas.getByText("Email me about product updates"));
    await expect(checkbox).toBeChecked();
    await expect(args.onCheckedChange).not.toHaveBeenCalled();
  },
};
