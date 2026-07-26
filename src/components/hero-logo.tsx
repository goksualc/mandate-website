"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

export function HeroLogo() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center">
      <div className="hero-logo-glow absolute inset-0 -z-10" aria-hidden />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full text-border-strong"
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden
      >
        <circle cx="200" cy="200" r="170" stroke="currentColor" strokeWidth="1" strokeDasharray="2 10" opacity="0.5" />
        <circle cx="200" cy="200" r="140" stroke="var(--accent)" strokeWidth="1" opacity="0.18" />
        <path
          d="M60 260 C 140 220, 260 220, 340 260"
          stroke="var(--accent)"
          strokeWidth="1"
          opacity="0.2"
        />
        <path
          d="M60 140 C 140 180, 260 180, 340 140"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.35"
        />
      </svg>

      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
        animate={
          reduceMotion
            ? { opacity: 1 }
            : { opacity: 1, y: [0, -10, 0] }
        }
        transition={
          reduceMotion
            ? { duration: 0.6 }
            : { opacity: { duration: 0.6 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }
        }
        className="relative w-2/3"
      >
        <Image
          src="/logo.png"
          alt="MANDATE owl logo"
          width={420}
          height={420}
          priority
          className="h-auto w-full object-contain drop-shadow-[0_18px_40px_rgba(169,20,43,0.18)]"
        />
      </motion.div>
    </div>
  );
}
