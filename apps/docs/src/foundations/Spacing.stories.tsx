import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";

import { base, Page, remToPx, Section, TokenTable, tokensWithPrefix } from "./shared";

const meta = {
  title: "Foundations/Spacing & Radius",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

export const Spacing: StoryObj = {
  render: () => (
    <Page
      title="Spacing"
      intro="A 4px-based scale in rem. The number is a multiplier: space-4 is 4 × 4px = 16px. Use these for padding, gaps and layout."
    >
      <Section title="Scale" description="Bars are drawn at each token's actual width.">
        <TokenTable
          columns={["Preview", "Token", "Rem", "Px"]}
          rows={tokensWithPrefix("space-").map((name) => ({
            key: name,
            cells: [
              <div aria-hidden style={{ ...bar, width: `var(--${name})` }} />,
              `--${name}`,
              base[name],
              remToPx(base[name]!),
            ],
          }))}
        />
      </Section>
    </Page>
  ),
};

export const Radius: StoryObj = {
  render: () => (
    <Page
      title="Radius"
      intro="Corner rounding. Roughly: sm for chips and checkboxes, md for buttons and inputs, lg and xl for cards and dialogs, full for pills and avatars."
    >
      <Section title="Scale" description="Each box uses the token as its border-radius.">
        <TokenTable
          columns={["Preview", "Token", "Value", "Px"]}
          rows={tokensWithPrefix("radius-").map((name) => ({
            key: name,
            cells: [
              <div aria-hidden style={{ ...box, borderRadius: `var(--${name})` }} />,
              `--${name}`,
              base[name],
              remToPx(base[name]!),
            ],
          }))}
        />
      </Section>
    </Page>
  ),
};

// --- Styles ----------------------------------------------------------------

const bar: CSSProperties = {
  height: "var(--space-4)",
  minWidth: "1px", // keeps space-0 visible as a hairline
  background: "var(--color-bg-accent)",
  borderRadius: "var(--radius-sm)",
};

const box: CSSProperties = {
  width: "var(--space-16)",
  height: "var(--space-16)",
  background: "var(--color-bg-accent-subtle)",
  border: "2px solid var(--color-border-focus)",
};
