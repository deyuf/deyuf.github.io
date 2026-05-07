"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "!@#$%^&*()_+-=[]{}|;':,.<>/?abcdefghijklmnopqrstuvwxyz0123456789";

function scramble(target: string, progress: number) {
  const visible = Math.floor(progress * target.length);
  let out = "";
  for (let i = 0; i < target.length; i++) {
    if (i < visible) out += target[i];
    else if (target[i] === " ") out += " ";
    else out += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return out;
}

export function ScrambleText({
  text,
  duration = 900,
  trigger = "mount",
  className,
}: {
  text: string;
  duration?: number;
  trigger?: "mount" | "hover";
  className?: string;
}) {
  const [display, setDisplay] = useState(text);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  const run = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const p = Math.min(1, elapsed / duration);
      setDisplay(scramble(text, p));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (trigger === "mount") run();
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span
      className={className}
      onMouseEnter={trigger === "hover" ? run : undefined}
    >
      {display}
    </span>
  );
}
