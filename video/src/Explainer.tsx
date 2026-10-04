import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { LEN, TRANS, TOTAL, VOICE, LINES } from "./timeline";
import { Hook, Problem, Result, Cta } from "./Scenes";
import { Product } from "./Product";
import { Subtitle } from "./kit";
import { C } from "./lib";

export const TOTAL_FRAMES = TOTAL;

const T = linearTiming({ durationInFrames: TRANS });
// music bed: fade in/out, ducked ~6 dB (x0.5) while the voice speaks
const MUSIC_BASE = 0.5;
const musicVol = (f: number) => {
  const duck = VOICE.reduce((m, v) => {
    const a = v.at - 6, b = v.at + v.dur + 10;
    const r = Math.min(1, Math.max(0, Math.min(f - a, b - f) / 10));
    return Math.max(m, r);
  }, 0);
  const fin = Math.min(1, f / 45), fout = Math.min(1, Math.max(0, (TOTAL - f) / 90));
  return MUSIC_BASE * (1 - 0.5 * duck) * fin * fout;
};

export const Explainer: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={LEN[0]}><Hook /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={T} />
      <TransitionSeries.Sequence durationInFrames={LEN[1]}><Problem /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={T} />
      <TransitionSeries.Sequence durationInFrames={LEN[2]}><Product /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={T} />
      <TransitionSeries.Sequence durationInFrames={LEN[3]}><Result /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={T} />
      <TransitionSeries.Sequence durationInFrames={LEN[4]}><Cta /></TransitionSeries.Sequence>
    </TransitionSeries>
    <Audio src={staticFile("music.wav")} volume={musicVol} />
    {VOICE.map((v) => (
      <Sequence key={v.line} from={v.at} durationInFrames={v.dur + 4} layout="none">
        <Audio src={staticFile(`vo/s${v.line + 1}.wav`)} volume={1} />
      </Sequence>
    ))}
    {VOICE.map((v) => <Subtitle key={v.line} line={LINES[v.line]} at={v.at} dur={v.dur} bottom={v.line >= 2 && v.line <= 4 ? 22 : 44} />)}
  </AbsoluteFill>
);
