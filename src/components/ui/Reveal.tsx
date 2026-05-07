"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { fadeUp } from "@/lib/motion";

export function Reveal({
  children,
  delay = 0,
  className,
  as,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
}) {
  const reduced = useReducedMotion();
  const Component = motion[as ?? "div"];
  return (
    <Component
      className={className}
      initial={reduced ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      variants={fadeUp}
    >
      {children}
    </Component>
  );
}
