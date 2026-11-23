import { readFileSync } from "node:fs";

import { expect, test } from "@playwright/test";

// Storybook's build writes an index of every story; one test per story × theme.
interface IndexEntry {
  id: string;
  title: string;
  name: string;
  type: "story" | "docs";
}

const index = JSON.parse(readFileSync(new URL("../storybook-static/index.json", import.meta.url), "utf8")) as {
  entries: Record<string, IndexEntry>;
};

const stories = Object.values(index.entries).filter((entry) => entry.type === "story");
const themes = ["light", "dark"] as const;

for (const story of stories) {
  for (const theme of themes) {
    test(`${story.title} › ${story.name} › ${theme}`, async ({ page }) => {
      await page.goto(`/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`);

      // Wait until Storybook has rendered the story AND run its play function,
      // so interaction stories are captured in their final state.
      await page.waitForFunction(() => {
        const preview = (window as { __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } } })
          .__STORYBOOK_PREVIEW__;
        return preview?.currentRender?.phase === "finished";
      });
      await page.evaluate(() => document.fonts.ready);

      await expect(page).toHaveScreenshot(`${story.id}--${theme}.png`, { fullPage: true });
    });
  }
}
