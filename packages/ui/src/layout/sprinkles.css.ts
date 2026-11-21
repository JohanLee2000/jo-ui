// Sprinkles: a vanilla-extract tool that generates one small CSS class per
// property × value × breakpoint at build time, then picks classes at runtime:
//
//   sprinkles({ gap: { base: 2, md: 4 } })
//   → "gap_2_base gap_4_md"   (".gap_4_md" lives inside @media (min-width: 768px))
//
// Allowed values come from tokens, so `gap={7}` is a type error: there's no
// space-7. This file is the single place that decides which layout props exist.

import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";

import tokens from "@jo-ui/tokens/json/base.json";

import { vars } from "../theme/vars.css";

// --- Breakpoints (read from tokens at build time) ----------------------------

const minWidth = (breakpoint: string) => ({ "@media": `screen and (min-width: ${breakpoint})` });

/** Mobile-first: `base` applies everywhere, each breakpoint from that width up. */
export const breakpoints = {
  base: {},
  sm: minWidth(tokens["breakpoint-sm"]),
  md: minWidth(tokens["breakpoint-md"]),
  lg: minWidth(tokens["breakpoint-lg"]),
  xl: minWidth(tokens["breakpoint-xl"]),
} as const;

// --- Token scales ------------------------------------------------------------

// Numeric keys, so props read naturally: gap={4} rather than gap="4".
export const space = {
  0: vars.space[0],
  1: vars.space[1],
  2: vars.space[2],
  3: vars.space[3],
  4: vars.space[4],
  5: vars.space[5],
  6: vars.space[6],
  8: vars.space[8],
  10: vars.space[10],
  12: vars.space[12],
  16: vars.space[16],
  20: vars.space[20],
  24: vars.space[24],
} as const;

// columns={3} → three equal columns. minmax(0, 1fr) lets columns shrink below
// their content's width, so long words don't blow out the grid.
const columns = Object.fromEntries(
  Array.from({ length: 12 }, (_, i) => [i + 1, `repeat(${i + 1}, minmax(0, 1fr))`]),
) as Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12, string>;

// --- Properties that can change per breakpoint -------------------------------

const responsiveProperties = defineProperties({
  conditions: breakpoints,
  defaultCondition: "base",
  properties: {
    display: ["none", "block", "inline-block", "flex", "inline-flex", "grid"],
    flexDirection: ["row", "column", "row-reverse", "column-reverse"],
    flexWrap: ["wrap", "nowrap"],
    alignItems: ["stretch", "flex-start", "center", "flex-end", "baseline"],
    justifyContent: ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"],
    gridTemplateColumns: columns,
    gap: space,
    rowGap: space,
    columnGap: space,
    paddingTop: space,
    paddingBottom: space,
    paddingLeft: space,
    paddingRight: space,
    textAlign: ["left", "center", "right"],
    // Responsive so headings can grow with the screen: size={{ base: "2xl", md: "4xl" }}
    fontSize: vars.font.size,
  },
  shorthands: {
    padding: ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"],
    paddingX: ["paddingLeft", "paddingRight"],
    paddingY: ["paddingTop", "paddingBottom"],
  },
});

// --- Properties that don't change per breakpoint -----------------------------
// Colors already switch with the theme through CSS variables.

const staticProperties = defineProperties({
  properties: {
    background: vars.color.bg,
    color: vars.color.text,
    borderRadius: vars.radius,
    fontWeight: vars.font.weight,
    fontFamily: vars.font.family,
  },
});

export const sprinkles = createSprinkles(responsiveProperties, staticProperties);

/** Every prop sprinkles accepts, with its allowed values (and responsive objects). */
export type Sprinkles = Parameters<typeof sprinkles>[0];
