import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CSSProperties } from "react";

import darkTokens from "@jo-ui/tokens/json/dark.json";
import lightTokens from "@jo-ui/tokens/json/light.json";

import { Page, Section, TokenTable } from "./shared";

// Both files have the same keys (e.g. "color-bg-canvas"), so we can list the
// names from one and look up values in either.
const light: Record<string, string> = lightTokens;
const dark: Record<string, string> = darkTokens;

const meta = {
  title: "Foundations/Colors",
  parameters: {
    layout: "padded",
    // The disabled-text sample is low contrast on purpose (WCAG exempts
    // disabled controls), so it's excluded from the automated contrast check.
    a11y: { context: { exclude: ["[data-intentionally-low-contrast]"] } },
  },
} satisfies Meta;

export default meta;

export const Semantic: StoryObj = {
  render: () => <ColorPage />,
};

// ---------------------------------------------------------------------------

type Group = { title: string; prefix: string; description: string };

const groups: Group[] = [
  {
    title: "Backgrounds",
    prefix: "color-bg-",
    description: "Fills for pages, surfaces and interactive elements.",
  },
  {
    title: "Text",
    prefix: "color-text-",
    description: "Foreground colors, shown on the background they're meant for.",
  },
  {
    title: "Borders",
    prefix: "color-border-",
    description: "Dividers, input outlines and focus rings.",
  },
];

function ColorPage() {
  return (
    <Page
      title="Colors"
      intro="Semantic color tokens. Previews follow the theme selected in the toolbar; the Light and Dark columns show each theme's resolved value."
    >
      {groups.map((group) => (
        <Section key={group.prefix} title={group.title} description={group.description}>
          <TokenTable
            columns={["Preview", "Token", "Light", "Dark"]}
            rows={Object.keys(light)
              .filter((name) => name.startsWith(group.prefix))
              .map((name) => ({
                key: name,
                cells: [<Preview name={name} />, `--${name}`, light[name], dark[name]],
              }))}
          />
        </Section>
      ))}
    </Page>
  );
}

// Shows each token the way it's actually used. Previews are decorative
// (the token name is the real content), so they're hidden from screen readers.
function Preview({ name }: { name: string }) {
  const value = `var(--${name})`;

  if (name.startsWith("color-text-")) {
    return (
      <div
        aria-hidden
        data-intentionally-low-contrast={name === "color-text-disabled" ? "" : undefined}
        style={{ ...swatch, ...textSample, color: value, background: backgroundFor(name) }}
      >
        Aa
      </div>
    );
  }

  if (name.startsWith("color-border-")) {
    return <div aria-hidden style={{ ...swatch, border: `2px solid ${value}` }} />;
  }

  return <div aria-hidden style={{ ...swatch, background: value }} />;
}

// "On" colors are only readable on their matching fill; everything else sits on a surface.
function backgroundFor(textToken: string) {
  if (textToken === "color-text-on-accent") return "var(--color-bg-accent)";
  if (textToken === "color-text-on-danger") return "var(--color-bg-danger)";
  return "var(--color-bg-surface)";
}

// --- Styles (tokens only) --------------------------------------------------

const swatch: CSSProperties = {
  width: "var(--space-12)",
  height: "var(--space-12)",
  borderRadius: "var(--radius-md)",
  border: "1px solid var(--color-border-default)",
  background: "var(--color-bg-surface)",
};

const textSample: CSSProperties = {
  display: "grid",
  placeItems: "center",
  fontSize: "var(--font-size-lg)",
  fontWeight: "var(--font-weight-semibold)",
};
