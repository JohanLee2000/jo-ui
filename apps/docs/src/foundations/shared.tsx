// Building blocks shared by the Foundations pages, so every page has the
// same layout and table styling. Styled with tokens only.
import type { CSSProperties, ReactNode } from "react";

import baseTokens from "@jo-ui/tokens/json/base.json";

/** Theme-independent tokens (space, radius, font, motion) as a name → value map. */
export const base: Record<string, string | number> = baseTokens;

/** All token names starting with a prefix, e.g. "space-" → ["space-0", "space-1", ...]. */
export function tokensWithPrefix(prefix: string) {
  return Object.keys(base).filter((name) => name.startsWith(prefix));
}

/** "1.5rem" → "24px" (assuming the default 16px root font size). */
export function remToPx(value: string | number) {
  const text = String(value);
  return text.endsWith("rem") ? `${parseFloat(text) * 16}px` : text;
}

export function Page({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <div style={{ display: "grid", gap: "var(--space-10)", maxWidth: "48rem" }}>
      <header>
        <h1 style={{ margin: 0, fontSize: "var(--font-size-3xl)" }}>{title}</h1>
        <p style={mutedText}>{intro}</p>
      </header>
      {children}
    </div>
  );
}

export function Section({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section>
      <h2 style={{ margin: 0, fontSize: "var(--font-size-xl)" }}>{title}</h2>
      <p style={mutedText}>{description}</p>
      {children}
    </section>
  );
}

/** A table with a header row; each row is an array of cells matching `columns`. */
export function TokenTable({ columns, rows }: { columns: string[]; rows: { key: string; cells: ReactNode[] }[] }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column} style={headerCell}>
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key}>
            {row.cells.map((content, i) => (
              <td key={i} style={i === 0 ? cell : { ...cell, ...mono }}>
                {content}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// --- Styles ----------------------------------------------------------------

export const mutedText: CSSProperties = { color: "var(--color-text-muted)" };

export const cell: CSSProperties = {
  padding: "var(--space-3) var(--space-4)",
  borderBottom: "1px solid var(--color-border-default)",
  textAlign: "left",
  verticalAlign: "middle",
};

export const headerCell: CSSProperties = {
  ...cell,
  fontSize: "var(--font-size-sm)",
  fontWeight: "var(--font-weight-semibold)",
  color: "var(--color-text-muted)",
};

export const mono: CSSProperties = {
  fontFamily: "var(--font-family-mono)",
  fontSize: "var(--font-size-sm)",
  whiteSpace: "nowrap",
};
