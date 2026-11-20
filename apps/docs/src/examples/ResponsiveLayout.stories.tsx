import type { Meta, StoryObj } from "@storybook/react-vite";

import { Box, Button, Container, Grid, Inline, Stack } from "@jo-ui/ui";

const meta = {
  title: "Examples/Responsive Layout",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;

const features = [
  ["Design tokens", "One source of truth for color, spacing and type, built with Style Dictionary."],
  ["Themes", "Light, dark and system themes, switched with a data attribute and no flash."],
  ["Accessible", "WCAG AA contrast checked in CI, keyboard support and visible focus rings."],
  ["Type-safe styles", "vanilla-extract recipes: variant props come straight from the styles."],
  ["Responsive props", "gap={{ base: 2, md: 6 }} — layouts adapt per breakpoint."],
  ["Game ready", "The same tokens will power HUDs and menus over a canvas."],
] as const;

/**
 * The Phase 2 milestone: a page built only from layout components and tokens.
 * Resize the canvas (or use Storybook's viewport menu): the header stacks,
 * the hero buttons wrap and the feature grid goes 1 → 2 → 3 columns.
 */
export const LandingPage: StoryObj = {
  render: () => (
    <Box background="canvas" paddingY={{ base: 6, md: 12 }}>
      <Container as="main">
        <Stack gap={{ base: 8, md: 12 }}>
          {/* Header: stacked on phones, one row from md up */}
          <Stack
            as="header"
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            gap={4}
          >
            <strong>jo-ui</strong>
            <Inline as="nav" aria-label="Main" gap={2}>
              <Button variant="ghost" size="sm">
                Docs
              </Button>
              <Button variant="ghost" size="sm">
                Components
              </Button>
              <Button size="sm">Get started</Button>
            </Inline>
          </Stack>

          {/* Hero */}
          <Stack as="section" aria-labelledby="hero-title" gap={4} align="flex-start">
            <h1 id="hero-title" style={{ margin: 0, fontSize: "var(--font-size-4xl)", lineHeight: "var(--font-line-height-tight)" }}>
              One design system for sites, apps and games
            </h1>
            <p style={{ margin: 0, color: "var(--color-text-muted)", maxWidth: "40rem" }}>
              Every color, gap and breakpoint on this page comes from design tokens.
            </p>
            <Inline gap={3}>
              <Button size="lg">Get started</Button>
              <Button size="lg" variant="outline">
                View on GitHub
              </Button>
            </Inline>
          </Stack>

          {/* Features: 1 column, 2 from sm, 3 from lg */}
          <Grid as="ul" aria-label="Features" columns={{ base: 1, sm: 2, lg: 3 }} gap={{ base: 3, md: 4 }} padding={0} style={{ listStyle: "none", margin: 0 }}>
            {features.map(([title, text]) => (
              <Stack as="li" key={title} gap={2} padding={5} background="surface" borderRadius="lg" style={{ border: "1px solid var(--color-border-default)" }}>
                <strong>{title}</strong>
                <Box as="p" color="muted" style={{ margin: 0 }}>
                  {text}
                </Box>
              </Stack>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  ),
};
