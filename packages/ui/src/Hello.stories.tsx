import type { Meta, StoryObj } from "@storybook/react-vite";

import { Hello } from "./Hello";

// The default export ("meta") describes the component as a whole:
// where it appears in the sidebar, which component it documents, and
// args shared by every story below.
const meta = {
  title: "Placeholders/Hello",
  component: Hello,
  tags: ["autodocs"], // generate a Docs page with a props table
} satisfies Meta<typeof Hello>;

export default meta;
type Story = StoryObj<typeof meta>;

// Each named export is one story: the component in one specific state.
export const Default: Story = {};

export const CustomName: Story = {
  args: {
    name: "Jo",
  },
};
