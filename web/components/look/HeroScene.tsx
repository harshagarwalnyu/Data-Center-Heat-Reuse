"use client";
import type { ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useStill } from "@/lib/motion";

/**
 * Golden-hour Cayuga Lake, painted in layered SVG: sky, rays, clouds, far hills, the lake,
 * a low data center on the near shore whose heat curls over to a greenhouse and a cluster of homes.
 * Brush edges come from feTurbulence + feDisplacementMap; a paper grain sits on top. Decorative only.
 */
const W = 1600, H = 1000;

function Layer({ p, depth, still, children }: { p: MotionValue<number>; depth: number; still: boolean; children: ReactNode }) {
  const y = useTransform(p, [0, 1000], [0, depth], { clamp: true });
  return <motion.g style={still ? undefined : { y }}>{children}</motion.g>;
}

const House = ({ x, y, s = 1, roof = "#9c4a2e", wall = "#f1e2c6" }: { x: number; y: number; s?: number; roof?: string; wall?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x="-22" y="-26" width="44" height="30" fill={wall} />
    <rect x="-22" y="-26" width="44" height="30" fill="url(#wallShade)" />
    <path d="M-28 -24 L0 -48 L28 -24 Z" fill={roof} />
    <rect x="-12" y="-17" width="8" height="8" fill="#f7c873" />
    <rect x="5" y="-17" width="8" height="8" fill="#f7c873" opacity="0.85" />
    <rect x="-3" y="-8" width="7" height="12" fill="#6b4630" />
    <rect x="12" y="-46" width="5" height="12" fill="#7a5a44" />
  </g>
);

const Tree = ({ x, y, s = 1, c = "#5f6f2c" }: { x: number; y: number; s?: number; c?: string }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#brush)">
    <rect x="-2" y="-8" width="4" height="14" fill="#5a4330" />
    <ellipse cx="0" cy="-26" rx="16" ry="22" fill={c} />
    <ellipse cx="-6" cy="-32" rx="8" ry="10" fill="#8f9a45" opacity="0.7" />
  </g>
);

export function HeroScene() {

  const still = useStill();
  const { scrollY: p } = useScroll();
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice" aria-hidden focusable="false" className="absolute inset-0 w-full h-full block">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9dbe0" />
          <stop offset="0.35" stopColor="#e9e6d6" />
          <stop offset="0.6" stopColor="#f7e2bb" />
          <stop offset="0.72" stopColor="#f4cf98" />
        </linearGradient>
        <radialGradient id="sun" cx="0.66" cy="0.6" r="0.5">
          <stop offset="0" stopColor="#fff7df" stopOpacity="1" />
          <stop offset="0.18" stopColor="#ffe9b8" stopOpacity="0.85" />
          <stop offset="0.5" stopColor="#f7d39a" stopOpacity="0.25" />
          <stop offset="1" stopColor="#f7d39a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ray" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff4d6" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff4d6" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff4d6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3dcae" />
          <stop offset="0.35" stopColor="#c9d3c8" />
          <stop offset="1" stopColor="#8fb0b6" />
        </linearGradient>
        <linearGradient id="farHill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9b9c4" />
          <stop offset="1" stopColor="#d9cdb8" />
        </linearGradient>
        <linearGradient id="midHill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c7c27a" />
          <stop offset="1" stopColor="#8e9a4b" />
        </linearGradient>
        <linearGradient id="nearHill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9b864" />
          <stop offset="0.5" stopColor="#7f8b3d" />
          <stop offset="1" stopColor="#5d6a2c" />
        </linearGradient>
        <linearGradient id="dcWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efe4d0" />
          <stop offset="1" stopColor="#cdbda2" />
        </linearGradient>
        <linearGradient id="wallShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#5a3a20" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6fbf7" stopOpacity="0.95" />
          <stop offset="1" stopColor="#b9d6cf" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="heat" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#e9813f" stopOpacity="0.9" />
          <stop offset="1" stopColor="#f6c56b" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.82" stopColor="#fdfdfc" stopOpacity="0" />
          <stop offset="1" stopColor="#fdfdfc" stopOpacity="0.65" />
        </linearGradient>
        <filter id="brush" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="9" />
        </filter>
        <filter id="brushBig" x="-5%" y="-20%" width="110%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.05" numOctaves="3" seed="9" />
          <feDisplacementMap in="SourceGraphic" scale="18" />
        </filter>
        <filter id="cloud" x="-30%" y="-60%" width="160%" height="220%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="2" />
          <feDisplacementMap in="SourceGraphic" scale="40" />
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="soft"><feGaussianBlur stdDeviation="14" /></filter>
        <filter id="shimmer" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7" /></filter>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.25  0 0 0 0 0.15  0 0 0 0.55 0" />
        </filter>
      </defs>

      {/* sky, sun glow, rays */}
      <rect width={W} height={H} fill="url(#sky)" />
      <rect width={W} height={H} fill="url(#sun)" />
      <Layer p={p} depth={60} still={still}>
        <g opacity="0.55" filter="url(#soft)">
          <path d="M1060 600 L560 -40 L720 -40 Z" fill="url(#ray)" />
          <path d="M1060 600 L880 -40 L1000 -40 Z" fill="url(#ray)" />
          <path d="M1060 600 L1180 -40 L1320 -40 Z" fill="url(#ray)" />
          <path d="M1060 600 L1500 -40 L1640 60 Z" fill="url(#ray)" />
        </g>
        {/* clouds */}
        <g filter="url(#cloud)" className="drift">
          <g fill="#fffaf0" opacity="0.92">
            <ellipse cx="260" cy="190" rx="190" ry="48" />
            <ellipse cx="350" cy="160" rx="120" ry="50" />
            <ellipse cx="190" cy="170" rx="90" ry="40" />
          </g>
          <g fill="#fff6e6" opacity="0.85">
            <ellipse cx="1330" cy="250" rx="220" ry="46" />
            <ellipse cx="1260" cy="220" rx="120" ry="48" />
            <ellipse cx="1420" cy="226" rx="100" ry="40" />
          </g>
          <g fill="#fbe9cc" opacity="0.7">
            <ellipse cx="760" cy="420" rx="260" ry="22" />
            <ellipse cx="1180" cy="470" rx="200" ry="18" />
            <ellipse cx="380" cy="480" rx="180" ry="16" />
          </g>
        </g>
      </Layer>

      <g transform="translate(0 70)">
      {/* far hills across the lake */}
      <Layer p={p} depth={40} still={still}>
        <path filter="url(#brushBig)" fill="url(#farHill)" opacity="0.9"
          d="M-40 640 C120 600 240 590 380 612 C520 634 600 588 760 596 C920 604 1000 574 1160 590 C1320 606 1430 584 1640 600 L1640 680 L-40 680 Z" />
        <path filter="url(#brushBig)" fill="#a8ad7d" opacity="0.75"
          d="M-40 662 C160 640 300 648 460 656 C640 664 780 640 960 650 C1140 660 1300 642 1640 652 L1640 690 L-40 690 Z" />
      </Layer>

      {/* lake with shimmer */}
      <Layer p={p} depth={25} still={still}>
        <rect x="-40" y="676" width="1680" height="140" fill="url(#lake)" />
        <g stroke="#fff3d4" strokeLinecap="round" opacity="0.8">
          <line x1="980" y1="690" x2="1140" y2="690" strokeWidth="3" />
          <line x1="1000" y1="704" x2="1110" y2="704" strokeWidth="2.5" />
          <line x1="940" y1="720" x2="1180" y2="720" strokeWidth="2" opacity="0.6" />
          <line x1="1020" y1="738" x2="1090" y2="738" strokeWidth="2" />
          <line x1="300" y1="712" x2="420" y2="712" strokeWidth="1.6" opacity="0.5" />
          <line x1="620" y1="748" x2="700" y2="748" strokeWidth="1.6" opacity="0.5" />
        </g>
      </Layer>

      {/* near shore, mid hills */}
      <Layer p={p} depth={14} still={still}>
        <path filter="url(#brushBig)" fill="url(#midHill)"
          d="M-40 790 C140 750 300 744 460 768 C620 792 760 770 900 760 C1060 748 1200 770 1360 756 C1480 746 1560 752 1640 760 L1640 1000 L-40 1000 Z" />
        <path filter="url(#brush)" fill="#e6dc9a" opacity="0.5" d="M520 790 C640 776 760 784 860 774 C800 800 660 806 520 790 Z" />

        {/* data center on the shore */}
        <g filter="url(#brush)">
          <rect x="910" y="702" width="250" height="62" fill="url(#dcWall)" />
          <rect x="910" y="702" width="250" height="62" fill="url(#wallShade)" />
          <rect x="904" y="696" width="262" height="9" fill="#8d7b66" />
          <rect x="1170" y="722" width="80" height="42" fill="#d8c9ae" />
          <rect x="1166" y="717" width="88" height="7" fill="#8d7b66" />
          {[930, 970, 1010, 1050, 1090, 1130].map((x) => <rect key={x} x={x} y="720" width="24" height="10" fill="#6f8796" opacity="0.75" />)}
          {[930, 970, 1010, 1050, 1090, 1130].map((x) => <rect key={`b${x}`} x={x} y="740" width="24" height="10" fill="#6f8796" opacity="0.6" />)}
          {[940, 1000, 1060, 1120].map((x) => <rect key={`r${x}`} x={x} y="684" width="30" height="13" rx="2" fill="#a59680" />)}
        </g>
        {/* greenhouse */}
        <g filter="url(#brush)">
          <path d="M640 776 L640 742 Q700 704 760 742 L760 776 Z" fill="url(#glass)" stroke="#8aa69e" strokeWidth="2.5" />
          {[660, 680, 700, 720, 740].map((x) => <line key={x} x1={x} y1="776" x2={x} y2={x === 700 ? 718 : 734} stroke="#8aa69e" strokeWidth="1.6" />)}
          <path d="M770 778 L770 752 Q815 726 860 752 L860 778 Z" fill="url(#glass)" stroke="#8aa69e" strokeWidth="2.5" />
          <g fill="#7f9a3e" opacity="0.8"><circle cx="660" cy="768" r="6" /><circle cx="690" cy="766" r="7" /><circle cx="726" cy="768" r="6" /><circle cx="796" cy="770" r="6" /><circle cx="830" cy="770" r="6" /></g>
        </g>
        <Tree x={880} y={780} s={1.1} />
        <Tree x={1270} y={770} s={1.3} c="#56662a" />
        <Tree x={1300} y={776} s={0.9} />
        <Tree x={600} y={782} s={1} c="#56662a" />
      </Layer>

      {/* heat shimmer rising from the roof and curling toward greenhouse and homes */}
      <Layer p={p} depth={10} still={still}>
        <g fill="none" stroke="url(#heat)" strokeLinecap="round" filter="url(#shimmer)">
          <path className="heat-flow" strokeWidth="18" opacity="0.55" d="M960 682 C950 610 900 600 860 640 C820 680 790 700 760 720" />
          <path className="heat-flow" strokeWidth="16" opacity="0.45" style={{ animationDelay: "-3s" }} d="M1030 680 C1030 590 940 560 830 600 C700 646 600 700 520 760" />
          <path className="heat-flow" strokeWidth="14" opacity="0.4" style={{ animationDelay: "-6s" }} d="M1100 682 C1120 600 1040 540 900 560 C720 586 520 680 420 790" />
        </g>
      </Layer>

      {/* foreground hill with homes */}
      <Layer p={p} depth={0} still={still}>
        <path filter="url(#brushBig)" fill="url(#nearHill)"
          d="M-40 860 C120 820 260 806 420 822 C560 836 640 870 800 880 C980 892 1140 860 1300 850 C1440 842 1540 856 1640 866 L1640 1000 L-40 1000 Z" />
        <path filter="url(#brush)" fill="#d8cf86" opacity="0.45" d="M180 846 C280 828 380 828 470 840 C380 852 280 858 180 846 Z" />
        <path filter="url(#brush)" fill="none" stroke="#e8d9a8" strokeWidth="6" strokeLinecap="round" opacity="0.7" d="M760 1000 C740 960 640 930 520 900 C440 880 420 860 470 840" />
        <House x={430} y={826} s={1.15} />
        <House x={500} y={820} s={0.95} roof="#a8593a" />
        <House x={565} y={834} s={1.05} roof="#8a4128" wall="#f4e8d2" />
        <House x={360} y={836} s={0.9} roof="#b0603e" />
        <Tree x={300} y={846} s={1.2} c="#56662a" />
        <Tree x={630} y={846} s={1.1} />
        <Tree x={1440} y={870} s={1.6} c="#4f5e26" />
        <Tree x={1500} y={880} s={1.2} />
        <Tree x={90} y={870} s={1.5} c="#4f5e26" />
        <g fill="#f5e7b5" opacity="0.7">
          {[[220, 920], [260, 940], [900, 930], [1000, 950], [1180, 916], [1240, 960], [700, 960]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="3" />)}
        </g>
      </Layer>

      </g>
      <rect width={W} height={H} fill="url(#fade)" />
      <rect width={W} height={H} filter="url(#grain)" opacity="0.22" style={{ mixBlendMode: "multiply" }} />
    </svg>
  );
}
