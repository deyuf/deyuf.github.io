"use client";

import { motion, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { ArrowDown, ArrowRight, Github } from "lucide-react";
import { siteContent } from "@/lib/content";
import { heroChild, staggerChildren } from "@/lib/motion";
import { GridBackdrop } from "@/components/ui/GridBackdrop";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ScrambleText } from "@/components/ui/ScrambleText";

const RobotCanvas = dynamic(
  () => import("./RobotCanvas").then((m) => m.RobotCanvas),
  {
    ssr: false,
    loading: () => <RobotFallback />,
  }
);

function RobotFallback() {
  return (
    <svg
      viewBox="0 0 320 360"
      className="h-full w-full opacity-40"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="160" cy="320" r="42" />
        <path d="M160 280 L160 200" />
        <circle cx="160" cy="200" r="14" />
        <path d="M160 200 L240 140" />
        <circle cx="240" cy="140" r="12" />
        <path d="M240 140 L210 80" />
        <circle cx="210" cy="80" r="10" />
        <path d="M210 80 L240 50" />
      </g>
    </svg>
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <GridBackdrop className="opacity-60" />
      <div
        className="absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-bg to-transparent"
        aria-hidden
      />
      <div className="relative z-10 mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-10 px-5 pt-32 md:px-12 lg:grid-cols-[1.15fr_0.85fr] lg:pt-0">
        <motion.div
          initial={reduced ? false : "hidden"}
          animate="show"
          variants={staggerChildren}
          className="flex flex-col gap-7"
        >
          <motion.div variants={heroChild} className="flex items-center gap-3">
            <span className="eyebrow caret">
              <ScrambleText text={siteContent.eyebrow} duration={1100} />
            </span>
          </motion.div>
          <motion.h1
            variants={heroChild}
            className="display text-[clamp(3rem,9vw,7.5rem)] font-medium"
          >
            {siteContent.name.split(" ").map((part, i) => (
              <span key={i} className="block">
                {part}
              </span>
            ))}
          </motion.h1>
          <motion.p
            variants={heroChild}
            className="max-w-xl text-lg leading-relaxed muted md:text-xl"
          >
            {siteContent.heroSubhead}
          </motion.p>
          <motion.div
            variants={heroChild}
            className="mt-2 flex flex-wrap items-center gap-3"
          >
            <MagneticButton href="#projects" variant="primary">
              View work <ArrowRight size={16} />
            </MagneticButton>
            <MagneticButton
              href="https://github.com/deyuf"
              variant="ghost"
              external
            >
              <Github size={16} /> GitHub
            </MagneticButton>
          </motion.div>
          <motion.div
            variants={heroChild}
            className="mt-12 flex items-center gap-3 text-xs muted"
          >
            <ArrowDown size={14} className="animate-bounce" />
            <span className="font-mono uppercase tracking-widest">
              Scroll to explore
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="relative aspect-square w-full max-w-[560px] justify-self-end"
          style={{ color: "var(--color-accent)" }}
        >
          <RobotCanvas />
        </motion.div>
      </div>
    </section>
  );
}
