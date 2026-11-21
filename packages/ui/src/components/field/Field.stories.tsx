import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Input } from "../input/Input";
import { Textarea } from "../textarea/Textarea";
import { Field } from "./Field";

const meta = {
  title: "Forms/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { label: "Email", children: <Input type="email" placeholder="you@example.com" /> },
  decorators: [(Story) => <div style={{ maxWidth: "24rem" }}>{Story()}</div>],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The label is connected to the input: clicking it focuses the input. */
export const Basic: Story = {
  play: async ({ canvas, userEvent }) => {
    // getByLabelText only finds the input if the label is truly associated.
    const input = canvas.getByLabelText("Email");

    await userEvent.click(canvas.getByText("Email"));
    await expect(input).toHaveFocus();

    await userEvent.type(input, "jo@example.com");
    await expect(input).toHaveValue("jo@example.com");
  },
};

/** Hint and error are linked with aria-describedby, so they're read out with the input. */
export const WithHintAndError: Story = {
  args: {
    hint: "We'll only use it to send your receipt.",
    error: "Enter an email address like name@example.com.",
    required: true,
  },
  play: async ({ canvas }) => {
    const input = canvas.getByRole("textbox", { name: "Email" });

    await expect(input).toHaveAccessibleDescription(
      "We'll only use it to send your receipt. Enter an email address like name@example.com.",
    );
    await expect(input).toBeInvalid(); // aria-invalid="true"
    await expect(input).toBeRequired(); // announced as required
  },
};

export const Disabled: Story = {
  args: { disabled: true, hint: "Contact support to change your email." },
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText("Email")).toBeDisabled();
  },
};

/** Field works with any control that uses useFieldControl, like Textarea. */
export const WithTextarea: Story = {
  args: {
    label: "Bio",
    hint: "A sentence or two about you.",
    children: <Textarea rows={4} />,
  },
  play: async ({ canvas, userEvent }) => {
    const textarea = canvas.getByRole("textbox", { name: "Bio" });
    await expect(textarea).toHaveAccessibleDescription("A sentence or two about you.");
    await userEvent.type(textarea, "Line one{Enter}Line two");
    await expect(textarea).toHaveValue("Line one\nLine two");
  },
};
