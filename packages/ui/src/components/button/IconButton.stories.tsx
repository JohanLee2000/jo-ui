import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";

import { MenuIcon, PlusIcon, SearchIcon, TrashIcon, XIcon } from "@jo-ui/ui-icons";

import { Inline } from "../../layout/Stack";
import { Button } from "./Button";
import { IconButton } from "./IconButton";

const meta = {
  title: "Components/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: { "aria-label": "Close", children: <XIcon />, onClick: fn() },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Named by aria-label (the icon itself is hidden from screen readers), and square. */
export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    const button = canvas.getByRole("button", { name: "Close" });
    const box = button.getBoundingClientRect();

    await expect(box.width).toBe(box.height); // square
    await expect(box.height).toBe(40); // md

    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Variants: Story = {
  render: (args) => (
    <Inline gap={2}>
      <IconButton {...args} aria-label="Menu">
        <MenuIcon />
      </IconButton>
      <IconButton {...args} aria-label="Search" variant="outline">
        <SearchIcon />
      </IconButton>
      <IconButton {...args} aria-label="Add" variant="solid">
        <PlusIcon />
      </IconButton>
      <IconButton {...args} aria-label="Delete" variant="ghost" tone="danger">
        <TrashIcon />
      </IconButton>
    </Inline>
  ),
};

/** Same heights as Button at every size, so they line up in a toolbar. */
export const Sizes: Story = {
  render: (args) => (
    <Inline gap={2}>
      {(["sm", "md", "lg"] as const).map((size) => (
        <Inline key={size} gap={2} wrap="nowrap">
          <Button size={size} variant="outline">
            Save
          </Button>
          <IconButton {...args} size={size} variant="outline" aria-label={`More options (${size})`}>
            <MenuIcon />
          </IconButton>
        </Inline>
      ))}
    </Inline>
  ),
  play: async ({ canvas }) => {
    const saves = canvas.getAllByRole("button", { name: "Save" });
    const icons = canvas.getAllByRole("button", { name: /More options/ });
    for (const [i, save] of saves.entries()) {
      await expect(icons[i]!.getBoundingClientRect().height).toBe(save.getBoundingClientRect().height);
    }
  },
};
