"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";

/** What the app asks for. "system" follows the operating system's light/dark setting. */
export type Theme = "light" | "dark" | "system";

/** What's actually showing: "system" resolved to light or dark. */
export type ResolvedTheme = "light" | "dark";

export interface ThemeContextValue {
  /** The theme passed to the nearest ThemeProvider. */
  theme: Theme;
  /** The theme actually on screen, useful for things CSS can't switch (e.g. image sources). */
  resolvedTheme: ResolvedTheme;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  /** Theme for everything inside this provider. Defaults to following the OS. */
  theme?: Theme;
  children: ReactNode;
}

/**
 * Applies a theme to its subtree by setting `data-theme`; the token CSS does the rest.
 * Providers can be nested: the closest one wins (e.g. a dark panel inside a light page).
 *
 * Remembering the user's choice is the app's job: store it however you like and pass it in.
 */
export function ThemeProvider({ theme = "system", children }: ThemeProviderProps) {
  const prefersDark = usePrefersDark();
  const resolvedTheme: ResolvedTheme = theme === "system" ? (prefersDark ? "dark" : "light") : theme;

  // Only create a new value object when something changed, so components
  // calling useTheme() don't re-render every time this provider does.
  const value = useMemo(() => ({ theme, resolvedTheme }), [theme, resolvedTheme]);

  return (
    // .Provider (not <ThemeContext>) so this still works on React 18.3.
    <ThemeContext.Provider value={value}>
      {/* display: contents removes the div from layout, but CSS variables still
          inherit through it because inheritance follows the DOM tree. */}
      <div data-theme={theme} style={{ display: "contents" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/** Reads the nearest ThemeProvider's theme. Throws if there isn't one. */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme() must be used inside a <ThemeProvider>.");
  }
  return context;
}

// --- OS preference ----------------------------------------------------------

const DARK_QUERY = "(prefers-color-scheme: dark)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Whether the OS prefers dark mode, kept up to date if the user changes it.
 * useSyncExternalStore is React's tool for reading browser state safely:
 * on the server (no window) it uses the third argument instead.
 */
function usePrefersDark() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(DARK_QUERY).matches,
    () => false,
  );
}
