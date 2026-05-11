"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggle: () => {},
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initial value is set by the inline FOUC script in <head>; we read it
  // here so React state stays in sync with the DOM.
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const current =
      (document.documentElement.dataset.theme as Theme | undefined) ?? "dark";
    setThemeState(current);
  }, []);

  const apply = (t: Theme) => {
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem("theme", t);
    } catch {}
    setThemeState(t);
    // Notify non-React listeners (e.g. the R3F canvas)
    window.dispatchEvent(new CustomEvent("themechange", { detail: t }));
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggle: () => apply(theme === "dark" ? "light" : "dark"), setTheme: apply }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
