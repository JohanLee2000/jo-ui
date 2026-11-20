import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";

import { base, Page, remToPx, Section, TokenTable, tokensWithPrefix } from "./shared";

const meta = {
  title: "Foundations/Typography",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

const SAMPLE = "The quick brown fox jumps over the lazy dog";
const PARAGRAPH =
  "Line height is the space between lines of text. Body copy reads best around 1.5; headings can be tighter because they're short and large.";

export const TypeScale: StoryObj = {
  name: "Type Scale",
  render: () => (
    <Page
      title="Typography"
      intro="Font families, sizes, weights, line heights and letter spacing. Sizes are in rem so they follow the user's browser font size."
    >
      <Section title="Families" description="Each is a fallback list: the browser uses the first font that's available.">
        <TokenTable
          columns={["Sample", "Token"]}
          rows={tokensWithPrefix("font-family-").map((name) => ({
            key: name,
            cells: [<span style={{ fontFamily: `var(--${name})` }}>{SAMPLE}</span>, `--${name}`],
          }))}
        />
      </Section>

      <Section title="Sizes" description="From captions (xs) to page titles (4xl).">
        <TokenTable
          columns={["Sample", "Token", "Rem", "Px"]}
          rows={tokensWithPrefix("font-size-").map((name) => ({
            key: name,
            cells: [
              <span style={{ ...sample, fontSize: `var(--${name})` }}>{SAMPLE}</span>,
              `--${name}`,
              base[name],
              remToPx(base[name]!),
            ],
          }))}
        />
      </Section>

      <Section title="Weights" description="Shown at the lg size so the differences are easy to see.">
        <TokenTable
          columns={["Sample", "Token", "Value"]}
          rows={tokensWithPrefix("font-weight-").map((name) => ({
            key: name,
            cells: [
              <span style={{ ...sample, fontSize: "var(--font-size-lg)", fontWeight: `var(--${name})` }}>{SAMPLE}</span>,
              `--${name}`,
              base[name],
            ],
          }))}
        />
      </Section>

      <Section title="Line heights" description="Unitless multipliers of the font size. Compare how tall the same paragraph becomes.">
        <TokenTable
          columns={["Sample", "Token", "Value"]}
          rows={tokensWithPrefix("font-line-height-").map((name) => ({
            key: name,
            cells: [
              <p style={{ ...paragraph, lineHeight: `var(--${name})` }}>{PARAGRAPH}</p>,
              `--${name}`,
              base[name],
            ],
          }))}
        />
      </Section>

      <Section title="Letter spacing" description="In em, so it scales with the text. Tight suits large headings; wide suits small uppercase labels.">
        <TokenTable
          columns={["Sample", "Token", "Value"]}
          rows={tokensWithPrefix("font-letter-spacing-").map((name) => ({
            key: name,
            cells: [
              <span style={{ ...sample, fontSize: "var(--font-size-xl)", letterSpacing: `var(--${name})` }}>
                {SAMPLE}
              </span>,
              `--${name}`,
              base[name],
            ],
          }))}
        />
      </Section>
    </Page>
  ),
};

// --- Styles ----------------------------------------------------------------

const sample: CSSProperties = {
  display: "block",
  lineHeight: "var(--font-line-height-tight)",
};

const paragraph: CSSProperties = {
  margin: 0,
  padding: "var(--space-2) var(--space-3)",
  background: "var(--color-bg-subtle)",
  borderRadius: "var(--radius-sm)",
};
