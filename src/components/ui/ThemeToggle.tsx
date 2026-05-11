"use client";

import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const reduced = useReducedMotion();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isLight ? "dark" : "light"} theme`}
      title={`Switch to ${isLight ? "dark" : "light"} theme`}
      className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-border transition-colors hover:border-border-strong hover:bg-surface"
    >
      <AnimatePresence initial={false} mode="wait">
        {isLight ? (
          <motion.span
            key="sun"
            initial={reduced ? false : { y: -20, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={reduced ? undefined : { y: 20, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 grid place-items-center"
          >
            <Sun size={15} strokeWidth={1.7} />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={reduced ? false : { y: -20, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={reduced ? undefined : { y: 20, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 grid place-items-center"
          >
            <Moon size={14} strokeWidth={1.7} />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
