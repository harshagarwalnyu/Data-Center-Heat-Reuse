import A from "./audio.json";

export const FPS = 30;
export const TRANS = 14; // transition overlap, frames
export const LEAD = 16; // frames before the voice starts in a scene
export const TAIL = 18; // ~0.6 s of breathing room after the voice
export const GAP = 12; // pause between voice lines that share a scene
export const END_HOLD = 130; // extra hold on the end card

export const LINES: string[] = A.lines;
export const VO = A.durations.map((d) => Math.ceil(d * FPS));

// Scenes: 0 hook, 1 problem, 2 product (voice lines 2-4), 3 result, 4 cta
export const PRODUCT_VO = [LEAD, LEAD + VO[2] + GAP, LEAD + VO[2] + GAP + VO[3] + GAP]; // local starts of lines 2,3,4
export const LEN = [
  LEAD + VO[0] + TAIL,
  LEAD + VO[1] + TAIL,
  PRODUCT_VO[2] + VO[4] + TAIL,
  LEAD + VO[5] + TAIL,
  LEAD + VO[6] + TAIL + END_HOLD,
];
export const N = LEN.length;
export const START = LEN.map((_, i) => LEN.slice(0, i).reduce((a, b) => a + b, 0) - i * TRANS);
export const TOTAL = LEN.reduce((a, b) => a + b, 0) - (N - 1) * TRANS;

/** Voice clips: global start frame, line index, duration (frames). */
export const VOICE = [
  { line: 0, at: START[0] + LEAD },
  { line: 1, at: START[1] + LEAD },
  { line: 2, at: START[2] + PRODUCT_VO[0] },
  { line: 3, at: START[2] + PRODUCT_VO[1] },
  { line: 4, at: START[2] + PRODUCT_VO[2] },
  { line: 5, at: START[3] + LEAD },
  { line: 6, at: START[4] + LEAD },
].map((v) => ({ ...v, dur: VO[v.line] }));

/** Local frame (inside the line's scene) where `phrase` is spoken, estimated by character position. */
export const cue = (line: number, phrase: string, base = LEAD) => {
  const k = LINES[line].indexOf(phrase);
  if (k < 0) throw new Error(`cue phrase not in line ${line}: ${phrase}`);
  return base + Math.round((VO[line] * k) / LINES[line].length);
};

export const CPF = 1.5; // frames per typed character
export const typeFrames = (text: string, at: number, cpf = CPF) =>
  text.split("").map((ch, k) => ({ ch, f: at + Math.round(k * cpf) }));
