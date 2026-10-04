"use client";
import { useRef, type ReactNode } from "react";
import { motion, useInView, useScroll, useTransform, type MotionValue } from "framer-motion";

import { useStill } from "@/lib/motion";

const EASE = [0.05, 0.7, 0.1, 1] as const;

/** Content rises and fades in once as it enters view. Plain markup under reduced motion. */
export function Rise({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useStill();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div data-rise className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.45, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

/** Small icon that springs in with a slight overshoot as it enters view. */
export function Pop({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduce = useStill();
  if (reduce) return <span className="inline-flex">{children}</span>;
  return (
    <motion.span data-rise className="inline-flex" initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: [0.6, 1.1, 1], opacity: 1 }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 0.45, ease: "easeOut", delay }}>
      {children}
    </motion.span>
  );
}

function Word({ w, p, i, n }: { w: string; p: MotionValue<number>; i: number; n: number }) {
  const opacity = useTransform(p, [i / n, Math.min(1, (i + 2) / n)], [0.2, 1]);
  return <motion.span style={{ opacity }}>{w}{" "}</motion.span>;
}

/** Big serif statement that fills in word by word as you scroll. Native scroll only; each word goes from 20% to 100% opacity. */
export function ScrollReveal({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useStill();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.6"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className="serif font-bold m-0 max-w-[22ch] leading-[1.1] text-ink" style={{ fontSize: "clamp(2.1rem, 1rem + 4.4vw, 4.75rem)", textWrap: "balance" }}>
      {reduce ? text : words.map((w, i) => <Word key={i} w={w} p={scrollYProgress} i={i} n={words.length} />)}
    </p>
  );
}

const COL = "inline-block w-[1ch] text-center h-[1.1em] overflow-hidden align-bottom";

function Column({ digit, go, still, i }: { digit: number; go: boolean; still: boolean; i: number }) {
  return (
    <span aria-hidden className={COL}>
      <motion.span
        className="flex flex-col"
        initial={{ y: still ? `${-digit * 10}%` : "0%" }}
        animate={{ y: go || still ? `${-digit * 10}%` : "0%" }}
        transition={still ? { duration: 0 } : { duration: 0.9, ease: EASE, delay: i * 0.04 }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => <span key={d} className="block h-[1.1em] leading-[1.1]">{d}</span>)}
      </motion.span>
    </span>
  );
}

/** Odometer: each digit is a 0-9 column that rolls to its value (about 900ms) when the figure enters view. Static under reduced motion. */
export function Odometer({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const go = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useStill();
  return (
    <span ref={ref} className="num whitespace-nowrap">
      <span className="sr-only">{value}</span>
      {value.split("").map((c, i) => /\d/.test(c)
        ? <Column key={i} digit={Number(c)} go={go} still={reduce} i={i} />
        : <span key={i} aria-hidden className={COL}><span className="block h-[1.1em] leading-[1.1]">{c}</span></span>)}
    </span>
  );
}

/* Flat, tiny icons (36px). Colours come from the existing palette. */
const svgProps = { width: 36, height: 36, viewBox: "0 0 48 48", "aria-hidden": true, focusable: false } as const;

export const Tomato = () => (
  <svg {...svgProps}><circle cx="24" cy="27" r="15" fill="var(--ember)" /><path d="M24 12 l-6 5 6-2 6 2z M24 12 v-5" stroke="var(--good)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="var(--good)" /></svg>
);
export const Fish = () => (
  <svg {...svgProps}><ellipse cx="21" cy="24" rx="15" ry="9.5" fill="var(--teal)" /><path d="M33 24 l11-9 v18z" fill="var(--teal)" /><circle cx="14" cy="21.5" r="2.2" fill="var(--bg)" /></svg>
);
export const House = () => (
  <svg {...svgProps}><path d="M24 7 L43 23 H5z" fill="var(--ember)" /><rect x="10" y="22" width="28" height="19" rx="2" fill="var(--teal)" /><rect x="20" y="29" width="8" height="12" rx="1.5" fill="var(--bg)" /></svg>
);
export const NoFlame = () => (
  <svg {...svgProps}><path d="M24 5 C28 14 38 18 38 30 a14 14 0 0 1-28 0 C10 24 15 22 17 16 C20 19 21 14 24 5z" fill="var(--ember)" opacity="0.85" /><path d="M8 40 L40 8" stroke="var(--ink)" strokeWidth="4.5" strokeLinecap="round" /></svg>
);
