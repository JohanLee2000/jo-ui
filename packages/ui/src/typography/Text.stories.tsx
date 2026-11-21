import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

import { Box } from "../layout/Box";
import { Stack } from "../layout/Stack";
import { Text } from "./Text";

const meta = {
  title: "Typography/Text",
  component: Text,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { children: "The quick brown fox jumps over the lazy dog." },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Defaults: a <p> at size md, regular weight, no margin, color inherited. */
export const Default: Story = {
  play: async ({ canvas }) => {
    const text = canvas.getByText(/quick brown fox/);
    const style = getComputedStyle(text);

    await expect(text.tagName).toBe("P");
    await expect(style.fontSize).toBe("16px"); // font-size-md
    await expect(style.fontWeight).toBe("400"); // regular
    await expect(style.marginTop).toBe("0px"); // no browser <p> margin
    await expect(style.color).toBe(getComputedStyle(document.body).color); // inherited
  },
};

const sizes = ["xs", "sm", "md", "lg", "xl"] as const;

export const Sizes: Story = {
  render: (args) => (
    <Stack gap={2}>
      {sizes.map((size) => (
        <Text key={size} {...args} size={size}>
          {size}: {args.children}
        </Text>
      ))}
    </Stack>
  ),
};

const tones = ["primary", "muted", "accent", "success", "warning", "danger"] as const;

/** Tones are semantic color tokens, so they follow the theme. */
export const Tones: Story = {
  render: (args) => (
    <Stack gap={2}>
      {tones.map((tone) => (
        <Text key={tone} {...args} tone={tone} weight="medium">
          {tone}
        </Text>
      ))}
    </Stack>
  ),
};

/** `as` changes the element, e.g. for inline text inside a sentence. */
export const AsSpan: Story = {
  render: (args) => (
    <Text {...args}>
      Saved{" "}
      <Text as="span" tone="success" weight="semibold">
        2 minutes ago
      </Text>
      .
    </Text>
  ),
  play: async ({ canvas }) => {
    const inner = canvas.getByText("2 minutes ago");
    await expect(inner.tagName).toBe("SPAN");
    await expect(inner.parentElement?.tagName).toBe("P"); // valid nesting: span inside p
  },
};

/** Long text cut to one line with "…". */
export const Truncate: Story = {
  args: {
    truncate: true,
    children: "A very long file name that will not fit in the narrow box it has been given.pdf",
  },
  render: (args) => (
    <Box style={{ width: "16rem" }}>
      <Text {...args} />
    </Box>
  ),
  play: async ({ canvas }) => {
    const text = canvas.getByText(/very long file name/);
    await expect(getComputedStyle(text).textOverflow).toBe("ellipsis");
    await expect(text.scrollWidth).toBeGreaterThan(text.clientWidth); // really is cut off
  },
};
