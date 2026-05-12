"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import type { ReactNode } from "react";
import { useRef } from "react";

export function MagneticButton({
  children,
  href,
  variant = "primary",
  external = false,
  className = "",
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "ghost";
  external?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });
  const reduced = useReducedMotion();

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const limit = 16;
    x.set(Math.max(-limit, Math.min(limit, dx * 0.35)));
    y.set(Math.max(-limit, Math.min(limit, dy * 0.35)));
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors";

  const inlineStyle =
    variant === "primary"
      ? {
          background: "var(--color-fg)",
          color: "var(--color-bg)",
          x: sx,
          y: sy,
        }
      : {
          background: "transparent",
          color: "var(--color-fg)",
          border: "1px solid var(--color-border)",
          x: sx,
          y: sy,
        };

  const variantClass =
    variant === "primary"
      ? "hover:opacity-90"
      : "hover:bg-surface";

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={inlineStyle}
      className={`${base} ${variantClass} ${className}`}
    >
      {children}
    </motion.a>
  );
}
