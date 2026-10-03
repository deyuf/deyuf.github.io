"use client";

import { motion, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { siteContent } from "@/lib/content";
import { heroChild, staggerChildren } from "@/lib/motion";
import { MagneticButton } from "@/components/ui/MagneticButton";

const RobotCanvas = dynamic(() => import("./RobotCanvas").then((m) => m.RobotCanvas), {
  ssr: false,
  loading: () => <RobotFallback />,
});

function RobotFallback() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/models/ur5/poster.png" alt="" aria-hidden="true" className="h-full w-full object-contain" />
  );
}

export function Hero() {
  const reduced = useReducedMotion();
  return (
    <section id="hero" className="hero-stage">
      <div className="hero-atmosphere" aria-hidden="true" />
      <div className="hero-layout">
        <motion.div initial={reduced ? false : "hidden"} animate="show" variants={staggerChildren} className="hero-copy">
          <motion.div variants={heroChild} className="hero-kicker">
            <span className="hero-status-dot" />
            <span>{siteContent.eyebrow}</span>
          </motion.div>
          <motion.h1 variants={heroChild} className="hero-title">
            <span className="sr-only">{siteContent.name} — </span>
            <span>Intelligence.</span>
            <span className="hero-title-second">In motion.</span>
          </motion.h1>
          <motion.p variants={heroChild} className="hero-description">
            {siteContent.heroSubhead}
          </motion.p>
          <motion.div variants={heroChild} className="hero-actions">
            <MagneticButton href="#projects" variant="primary" className="!px-7 !py-4">
              Explore my work <ArrowRight size={17} />
            </MagneticButton>
            <a href="https://github.com/deyuf" target="_blank" rel="noopener noreferrer" className="hero-secondary-link">
              GitHub <ArrowUpRight size={16} />
            </a>
          </motion.div>
          <motion.div variants={heroChild} className="hero-signature">
            <span>{siteContent.name}</span>
            <span className="hero-signature-rule" />
            <span>Munich, Germany</span>
          </motion.div>
        </motion.div>

        <motion.div className="hero-visual" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.3, delay: 0.2 }}>
          <div className="hero-orbit" aria-hidden="true" />
          <div className="hero-model-label" aria-hidden="true">
            <span className="hero-label-rule" />
            <span>Six axes. Endless possibilities.</span>
          </div>
          <RobotCanvas />
          <div className="hero-model-footer" aria-hidden="true">
            <span>UR5 <span className="hero-label-divider">/</span> 6–DOF</span>
            <span>{reduced ? "Industrial manipulator" : "Move to explore"} <ArrowUpRight size={12} /></span>
          </div>
        </motion.div>
      </div>
      <div className="hero-bottom-bar">
        <a href="#projects" className="hero-scroll-link"><ArrowDown size={15} /> Selected work below</a>
        <div className="hero-disciplines"><span>Perception</span><span>Learning</span><span>Control</span></div>
        <span className="hero-edition">Digital → Physical</span>
      </div>
    </section>
  );
}
