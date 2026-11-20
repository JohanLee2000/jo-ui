// Checks that every theme's text/background pairs meet WCAG AA contrast.
// Exits with code 1 if any pair fails, so CI blocks the change.
//
// Reads the generated dist/json/*.json, so run the build first:
//   pnpm --filter @jo-ui/tokens check-contrast   (builds, then checks)

import { readdir, readFile } from "node:fs/promises";

const JSON_DIR = "dist/json";

// [foreground, background, minimum ratio]
// 4.5 = normal text, 3 = UI components (borders, focus rings).
const PAIRS = [
  ["text-primary", "bg-canvas", 4.5],
  ["text-primary", "bg-surface", 4.5],
  ["text-primary", "bg-subtle", 4.5],
  ["text-muted", "bg-canvas", 4.5],
  ["text-muted", "bg-surface", 4.5],
  ["text-muted", "bg-subtle", 4.5],
  ["text-accent", "bg-surface", 4.5],
  ["text-accent", "bg-accent-subtle", 4.5],
  ["text-on-accent", "bg-accent", 4.5],
  ["text-on-accent", "bg-accent-hover", 4.5],
  ["text-on-danger", "bg-danger", 4.5],
  ["text-on-danger", "bg-danger-hover", 4.5],
  ["text-danger", "bg-surface", 4.5],
  ["text-danger", "bg-danger-subtle", 4.5],
  ["text-success", "bg-surface", 4.5],
  ["text-success", "bg-success-subtle", 4.5],
  ["text-warning", "bg-surface", 4.5],
  ["text-warning", "bg-warning-subtle", 4.5],
  ["border-strong", "bg-surface", 3],
  ["border-focus", "bg-surface", 3],
  ["border-focus", "bg-canvas", 3],
  ["border-danger", "bg-surface", 3],
];

// --- Contrast math (WCAG 2.x) -----------------------------------------------

/** Relative luminance of a #rrggbb color: 0 for black, 1 for white. */
function luminance(hex) {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) throw new Error(`Expected a #rrggbb color, got "${hex}"`);

  // 1. Split into red, green, blue as 0–1.
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(match[1].slice(i, i + 2), 16) / 255);

  // 2. Undo the screen's brightness curve ("linearize").
  const linear = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

  // 3. Weight by how sensitive eyes are to each channel.
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** WCAG contrast ratio, from 1 (identical) to 21 (black on white). Order doesn't matter. */
function contrast(foreground, background) {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

// Sanity check: if the math is wrong, every result below is meaningless.
if (Math.abs(contrast("#000000", "#ffffff") - 21) > 0.001) {
  throw new Error("Contrast math is broken: black on white should be 21:1");
}

// --- Check every theme -------------------------------------------------------

// Every generated JSON except base.json is a theme, so new themes are
// picked up automatically.
const themes = (await readdir(JSON_DIR))
  .filter((file) => file.endsWith(".json") && file !== "base.json")
  .map((file) => file.replace(/\.json$/, ""));

if (themes.length === 0) {
  console.error(`No themes found in ${JSON_DIR}. Run the build first.`);
  process.exit(1);
}

const failures = [];

for (const theme of themes) {
  const tokens = JSON.parse(await readFile(`${JSON_DIR}/${theme}.json`, "utf8"));
  console.log(`\n${theme}`);

  for (const [fg, bg, minimum] of PAIRS) {
    const fgValue = tokens[`color-${fg}`];
    const bgValue = tokens[`color-${bg}`];

    // A missing token means a typo in PAIRS or a theme that's missing a
    // token. Either way it's a failure, never a silent pass.
    if (fgValue === undefined || bgValue === undefined) {
      const missing = fgValue === undefined ? fg : bg;
      console.log(`  ✘  ----  ${fg} on ${bg}  (token color-${missing} not found)`);
      failures.push(`${theme}: ${fg} on ${bg} (missing color-${missing})`);
      continue;
    }

    const ratio = contrast(fgValue, bgValue);
    const passed = ratio >= minimum;
    const mark = passed ? "✔" : "✘";
    console.log(`  ${mark} ${ratio.toFixed(2).padStart(5)}  ${fg} on ${bg}${passed ? "" : `  (needs ${minimum})`}`);

    if (!passed) {
      failures.push(`${theme}: ${fg} on ${bg} is ${ratio.toFixed(2)}, needs ${minimum}`);
    }
  }
}

console.log("");
if (failures.length > 0) {
  console.error(`✘ ${failures.length} contrast ${failures.length === 1 ? "check" : "checks"} failed:`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exitCode = 1;
} else {
  console.log(`✔ All ${PAIRS.length * themes.length} contrast checks passed across ${themes.length} themes.`);
}
