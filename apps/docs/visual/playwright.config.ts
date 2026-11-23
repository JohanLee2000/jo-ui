// Visual regression tests: a screenshot of every story, in light and dark,
// compared against approved "baseline" images committed to the repo. Any
// pixel change (an accidental color, spacing or font change) fails the test.
//
//   pnpm --filter @jo-ui/docs test:visual          compare against baselines
//   pnpm --filter @jo-ui/docs test:visual:update   accept changes as the new baselines
//
// Runs against the static Storybook build (storybook-static/), served locally.

import { defineConfig, devices } from "@playwright/test";

const PORT = 6008;

export default defineConfig({
  testDir: ".",
  outputDir: "./test-results",
  // Baselines live next to the spec, e.g. visual/__screenshots__/...
  snapshotPathTemplate: "{testDir}/__screenshots__/{platform}/{arg}{ext}",
  fullyParallel: true,
  // One retry. A real visual change fails both attempts; a rare rendering
  // hiccup passes the second time and is reported as "flaky" in the summary,
  // visible rather than hidden. (Seen once in ~10 runs while setting this up.)
  retries: 1,
  reporter: [["list"], ["html", { outputFolder: "./report", open: "never" }]],

  expect: {
    toHaveScreenshot: {
      // Animations are frozen at their end state and the caret is hidden, so
      // the same story always produces the same pixels.
      animations: "disabled",
      caret: "hide",
      // Strict: zero changed pixels allowed. A percentage tolerance sounds
      // safer but hides real changes: 0.1% of a 1024×768 page is ~790 pixels,
      // more than a 2px corner-radius change on a few buttons. Rendering is
      // deterministic on one machine, but fonts and anti-aliasing differ
      // between operating systems, which is why baselines are stored per
      // platform (__screenshots__/win32/). CI on Linux will need its own set.
      maxDiffPixels: 0,
      // Per-pixel color tolerance (0–1, default 0.2). 0.03 absorbs GPU
      // anti-aliasing noise (measured: up to 7/255 per channel on the edge of
      // a round focus ring between identical runs) while real changes, which
      // move whole pixels, still fail.
      // Known limit: the comparison deliberately ignores anti-aliased pixels
      // (to avoid flaky tests), so a tiny change that only touches edges, like
      // a 2px corner radius on one small button, can pass on its own. In a
      // real run the same change still fails every story that shows it
      // larger or in another state (tested: 54 of 132 failed).
      threshold: 0.03,
    },
  },

  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices["Desktop Chrome"],
    viewport: { width: 1024, height: 768 },
    // Freeze user preferences so results don't depend on the machine's settings.
    colorScheme: "light",
    reducedMotion: "reduce",
  },

  webServer: {
    // Runs from this visual/ folder, so the build is one level up.
    command: `pnpm exec vite preview --outDir ../storybook-static --port ${PORT} --strictPort`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
});
