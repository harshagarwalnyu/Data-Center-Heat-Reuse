"""Generates every SFX and the music bed with numpy/scipy. No downloads."""
import pathlib
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 44100
rng = np.random.default_rng(7)
pub = pathlib.Path(__file__).parent.parent / "public"
(sfx := pub / "sfx").mkdir(parents=True, exist_ok=True)


def norm(x, peak):
    return x * (peak / (np.max(np.abs(x)) + 1e-9))


def bp(x, lo, hi, order=2):
    return sosfilt(butter(order, [lo, hi], btype="band", fs=SR, output="sos"), x)


def lp(x, hz, order=2):
    return sosfilt(butter(order, hz, btype="low", fs=SR, output="sos"), x)


def save(name, x, peak=0.8):
    if x.ndim == 1:
        x = np.stack([x, x], 1)
    x = norm(x, peak)
    sf.write(sfx / name, x.astype(np.float32), SR)


def whoosh(dur=0.9, f0=300, f1=3200, seed=0, pan=(-0.8, 0.8)):
    r = np.random.default_rng(seed)
    n = int(dur * SR)
    t = np.linspace(0, 1, n)
    noise = r.standard_normal(n)
    # sweeping centre frequency via block-wise band-pass crossfade
    out = np.zeros(n)
    blocks = 24
    edges = np.linspace(0, n, blocks + 1).astype(int)
    for b in range(blocks):
        tc = (b + 0.5) / blocks
        fc = f0 * (f1 / f0) ** (tc ** 1.3)
        seg = bp(noise, fc * 0.6, min(fc * 1.5, SR / 2 - 100), 2)
        w = np.zeros(n)
        w[edges[b]:edges[b + 1]] = 1
        w = np.convolve(w, np.hanning(max(3, (edges[1] - edges[0]) * 2)), "same")
        out += seg * w
    env = (1 - np.exp(-t * 28)) * np.exp(-t * 3.2)  # fast attack, slow decay
    out *= env
    p = np.linspace(pan[0], pan[1], n)  # stereo pan movement
    L = out * np.sqrt((1 - p) / 2)
    R = out * np.sqrt((1 + p) / 2)
    return np.stack([L, R], 1)


def click(seed, pitch=1.0):
    r = np.random.default_rng(seed)
    n = int(0.06 * SR)
    t = np.arange(n) / SR
    tr = r.standard_normal(n) * np.exp(-t / 0.0012)  # ~3-5 ms transient
    tr = bp(tr, 1800 * pitch, 7000 * pitch)
    body = np.sin(2 * np.pi * 420 * pitch * t) * np.exp(-t / 0.008) * 0.45  # tiny resonant body
    body += np.sin(2 * np.pi * 1150 * pitch * t) * np.exp(-t / 0.004) * 0.2
    return tr + body


def thud():
    n = int(0.7 * SR)
    t = np.arange(n) / SR
    f = 46 + 90 * np.exp(-t * 22)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 7)
    tr = lp(rng.standard_normal(n), 900) * np.exp(-t / 0.012) * 0.6
    return body + tr


def tick(seed):
    r = np.random.default_rng(seed)
    n = int(0.03 * SR)
    t = np.arange(n) / SR
    x = bp(r.standard_normal(n), 3000, 9000) * np.exp(-t / 0.0015)
    return x + np.sin(2 * np.pi * 1700 * t) * np.exp(-t / 0.002) * 0.3


def pop():
    n = int(0.25 * SR)
    t = np.arange(n) / SR
    f = 420 + 380 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 16)


def chime():
    n = int(1.8 * SR)
    t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * t) * a for f, a in [(523.25, 1), (783.99, 0.6), (1046.5, 0.4)])
    return x * np.exp(-t * 2.2) * (1 - np.exp(-t * 60))


save("whoosh-a.wav", whoosh(0.95, 250, 3000, 1), 0.9)
save("whoosh-b.wav", whoosh(0.7, 400, 4200, 2, (0.8, -0.8)), 0.9)
save("whoosh-s.wav", whoosh(0.5, 500, 5000, 3, (-0.5, 0.5)), 0.9)
for i in range(8):
    save(f"click-{i}.wav", click(i, 0.9 + 0.2 * np.random.default_rng(100 + i).random()), 0.8)
for i in range(4):
    save(f"tick-{i}.wav", tick(i), 0.7)
save("thud.wav", thud(), 0.95)
save("pop.wav", pop(), 0.7)
save("chime.wav", chime(), 0.6)

# ---- music: slow evolving pad, 80 s ----
DUR = 80
n = DUR * SR
t = np.arange(n) / SR
chords = [  # Fmaj9, Am9, Cmaj9, Gsus-ish: MIDI-ish note sets
    [53, 57, 60, 64, 67], [57, 60, 64, 67, 71], [48, 55, 60, 64, 71], [55, 59, 62, 66, 69],
]
mid = lambda m: 440 * 2 ** ((m - 69) / 12)
seg = 20.0
pad = np.zeros(n)
for ci in range(5):
    notes = chords[ci % 4]
    centre = (ci + 0.5) * seg
    w = np.exp(-0.5 * ((t - centre) / (seg * 0.42)) ** 2)  # overlapping gaussian crossfade
    voice = np.zeros(n)
    for k, m in enumerate(notes):
        f = mid(m)
        for det in (-0.6, 0.0, 0.7):
            ph = rng.random() * 6.28
            lfo = 1 + 0.15 * np.sin(2 * np.pi * (0.05 + 0.02 * k) * t + ph)
            s = np.sin(2 * np.pi * (f + det) * t + ph)
            tri = 2 * np.abs(2 * ((f + det) * t % 1) - 1) - 1
            voice += (0.8 * s + 0.12 * tri) * lfo / (1 + k * 0.3)
    pad += voice * w
pad = lp(pad, 1400, 2)
pad = lp(pad, 900, 2)
fade = np.minimum(1, t / 5) * np.minimum(1, (DUR - t) / 6)
pad *= fade
L = pad + 0.25 * np.roll(pad, int(0.013 * SR))
R = pad + 0.25 * np.roll(pad, int(0.021 * SR))
m = np.stack([L, R], 1)
# scale to ~ -26 LUFS-ish (rms ~ -30 dBFS) as the base level
rms = np.sqrt(np.mean(m ** 2))
m *= 10 ** (-30 / 20) / rms
print("music peak", np.max(np.abs(m)))
sf.write(pub / "music.wav", m.astype(np.float32), SR)
print("done")
