"""Synthesizes one soundtrack per reel (no samples, so no licensing issues).

Warm ambient in D: a soft pad that moves to the next chord on every scene change,
a kalimba-like arpeggio, a quiet heartbeat pulse (a nod to cardiac coherence) and
a gentle sub bass. Every on-screen action gets its own synthesized hit, placed on
the frames listed in src/reels.json (the same timeline the animations use).

Usage: python3 scripts/music.py            -> public/music/<reel>.wav for every reel
"""
import json
import wave
import zlib
from pathlib import Path

import numpy as np
from scipy.signal import butter, fftconvolve, sosfilt

SR = 48000
ROOT = Path(__file__).resolve().parent.parent
TIMELINE = json.loads((ROOT / "src" / "reels.json").read_text())
FPS = TIMELINE["fps"]
T = TIMELINE["transition"]

BPM = 72
BEAT = 60 / BPM
# Dmaj9, Bm9, Gmaj9 (add 6), Asus4 — open, warm voicings around middle C
CHORDS = [[62, 66, 69, 73, 76], [59, 62, 66, 69, 73], [55, 62, 66, 71, 74], [57, 62, 64, 69, 73]]
BASS = [38, 35, 31, 33]
ARP = [0, 2, 1, 3, 2, 4, 1, 3]


def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)


def filt(x, kind, cutoff, order=2):
    return sosfilt(butter(order, cutoff, kind, fs=SR, output="sos"), x)


def place(track, sound, start):
    i = int(start * SR)
    if i >= track.shape[-1] or i < 0:
        return
    end = min(track.shape[-1], i + sound.shape[-1])
    track[..., i:end] += sound[..., : end - i]


def times(n):
    return np.arange(n) / SR


# ---------- instruments ----------

def pad_note(freq, dur, rng):
    t = times(int(dur * SR))
    out = np.zeros_like(t)
    for cents in (-7, 0, 7):
        f = freq * 2 ** (cents / 1200)
        ph = rng.uniform(0, 2 * np.pi)
        for h, a in ((1, 1.0), (2, 0.22), (3, 0.1), (4, 0.04)):
            out += a * np.sin(2 * np.pi * f * h * t + ph * h)
    return out * (1 + 0.07 * np.sin(2 * np.pi * 0.25 * t + rng.uniform(0, 6)))


def envelope(n, attack, release):
    env = np.ones(n)
    a, r = int(attack * SR), int(release * SR)
    env[:a] = np.linspace(0, 1, a) ** 2
    env[n - r :] *= np.linspace(1, 0, r) ** 2
    return env


def pluck(freq, vel=1.0):
    t = times(int(1.8 * SR))
    out = np.zeros_like(t)
    for h, a in ((1, 1.0), (2, 0.35), (3, 0.12), (4.1, 0.06)):
        out += a * np.sin(2 * np.pi * freq * h * t) * np.exp(-t * (2.2 + h * 1.6))
    out[: int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))
    return out * vel


def heartbeat():
    t = times(int(0.35 * SR))
    f = 44 + 22 * np.exp(-t * 30)
    thump = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 14)
    beat = np.zeros(int(0.7 * SR))
    beat[: len(thump)] += thump
    j = int(0.24 * SR)
    beat[j : j + len(thump)] += 0.65 * thump
    return filt(beat, "low", 180)


def bell(freq, length=2.6, gain=1.0):
    t = times(int(length * SR))
    out = np.zeros_like(t)
    for ratio, a, d in ((1, 1.0, 1.6), (2.0, 0.45, 2.2), (3.01, 0.22, 3.0), (4.2, 0.12, 4.5), (5.43, 0.08, 6.0)):
        out += a * np.sin(2 * np.pi * freq * ratio * t) * np.exp(-t * d)
    out[: int(0.003 * SR)] *= np.linspace(0, 1, int(0.003 * SR))
    return out * gain


def noise(sec, rng):
    return rng.standard_normal(int(sec * SR))


def whoosh(rng):
    n = noise(0.9, rng)
    lo, hi = filt(n, "band", [300, 1500]), filt(n, "band", [1500, 6000])
    x = np.linspace(0, 1, len(n))
    sweep = lo * (1 - x) + hi * x
    env = np.interp(x, [0, 0.55, 1], [0, 1, 0]) ** 2
    return sweep * env


def tick(rng):
    t = times(int(0.06 * SR))
    return (np.sin(2 * np.pi * 2100 * t) * 0.6 + filt(noise(0.06, rng), "high", 3000) * 0.4) * np.exp(-t * 90)


def pop():
    t = times(int(0.14 * SR))
    f = 380 + 700 * np.exp(-t * 45)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30)


def scratch(rng):
    n = filt(noise(0.22, rng), "band", [1800, 7000])
    x = np.linspace(0, 1, len(n))
    return n * np.interp(x, [0, 0.15, 0.8, 1], [0, 1, 0.7, 0]) * (1 + 0.5 * np.sin(2 * np.pi * 38 * x))


def swell(rng, chord):
    out = np.zeros(int(3.0 * SR))
    t = times(len(out))
    boom = np.sin(2 * np.pi * 55 * t) * np.exp(-t * 2.2)
    out += 0.9 * filt(boom, "low", 140)
    for k, m in enumerate(chord[1:]):
        place(out, bell(hz(m + 12), gain=0.35), 0.05 + k * 0.06)
    return out


# ---------- arrangement ----------

def scene_starts(scenes):
    starts, t = [], 0
    for i, s in enumerate(scenes):
        starts.append(t)
        t += s["frames"] - T
    return [s / FPS for s in starts]


def build(name, reel):
    rng = np.random.default_rng(zlib.crc32(name.encode()))
    scenes = reel["scenes"]
    starts = scene_starts(scenes)
    length = (sum(s["frames"] for s in scenes) - T * (len(scenes) - 1)) / FPS
    n = int(length * SR)
    wet = np.zeros((2, n))  # goes through the reverb
    dry = np.zeros((2, n))

    # chord changes land in the middle of each transition; the end card resolves home
    changes = [0.0] + [s + T / 2 / FPS for s in starts[1:]]
    chord_of = [i % len(CHORDS) for i in range(len(scenes))]
    chord_of[-1] = 0

    for i, c0 in enumerate(changes):
        c1 = changes[i + 1] if i + 1 < len(changes) else length
        chord, root = CHORDS[chord_of[i]], BASS[chord_of[i]]
        dur = c1 - c0 + 1.6
        for ch in range(2):
            voice = sum(pad_note(hz(m), dur, rng) for m in chord)
            voice = filt(voice, "low", 1900) * envelope(len(voice), 1.0 if i else 2.2, 1.6)
            place(wet[ch], voice * 0.06, c0)
        sub = np.sin(2 * np.pi * hz(root) * times(int(dur * SR))) * envelope(int(dur * SR), 0.4, 1.4)
        place(dry, np.stack([sub, sub]) * 0.07, c0)

        # arpeggio enters after the opening scene and stops before the end card's last seconds
        if i >= 1:
            step = BEAT / 2
            k, t = 0, c0
            while t < min(c1, length - 3.0):
                m = chord[ARP[k % len(ARP)]] + 12
                p = pluck(hz(m), vel=0.75 + 0.25 * rng.random())
                pan = 0.5 + 0.35 * np.sin(k * 1.3)
                place(wet, np.stack([p * (1 - pan), p * pan]) * 0.16, t)
                k, t = k + 1, t + step

    # heartbeat from the start until two seconds before the end
    hb = heartbeat()
    t = 0.15
    while t < length - 2.5:
        place(dry, np.stack([hb, hb]) * 0.3, t)
        t += BEAT

    # transitions
    for s in starts[1:]:
        w = whoosh(rng)
        peak = s + T / 2 / FPS
        place(wet, np.stack([w, w * 0.85]) * 0.10, peak - 0.55 * len(w) / SR)

    # on-screen actions
    for i, sc in enumerate(scenes):
        chord = CHORDS[chord_of[i]]
        for kind, frame in sc["sfx"]:
            at = starts[i] + frame / FPS
            if kind == "tick":
                s = tick(rng) * 0.12
            elif kind == "pop":
                s = pop() * 0.16
            elif kind == "scratch":
                s = scratch(rng) * 0.07
            elif kind.startswith("chime"):
                idx = {"chime": -1, "chime2": -2, "chime3": -1}[kind]
                up = {"chime": 12, "chime2": 12, "chime3": 24}[kind]
                s = bell(hz(chord[idx] + up), gain=0.16)
            elif kind == "shimmer":
                s = np.zeros(int(2.4 * SR))
                for k, m in enumerate(chord[1:]):
                    place(s, bell(hz(m + 24), length=1.8, gain=0.05), k * 0.05)
            elif kind == "swell":
                s = swell(rng, chord)
            else:
                raise ValueError(f"unknown sfx {kind}")
            place(wet, np.stack([s, s]), at)

    # reverb: decaying noise impulse response, independent per channel for width
    ir_t = times(int(2.6 * SR))
    for ch in range(2):
        ir = filt(rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 2.4), "low", 5000)
        ir /= np.sqrt(np.sum(ir**2))
        wet[ch] = wet[ch] * 0.75 + fftconvolve(wet[ch], ir)[:n] * 0.45

    mix = filt(wet + dry, "high", 28)
    fade = int(2.0 * SR)
    mix[:, -fade:] *= np.linspace(1, 0, fade) ** 1.5
    mix[:, : int(0.05 * SR)] *= np.linspace(0, 1, int(0.05 * SR))
    mix = np.tanh(mix * 1.3) / np.tanh(1.3)
    mix *= 0.89 / np.max(np.abs(mix))
    return mix, length


def write_wav(path, stereo):
    path.parent.mkdir(parents=True, exist_ok=True)
    data = (stereo.T * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


if __name__ == "__main__":
    for name, reel in TIMELINE["reels"].items():
        mix, length = build(name, reel)
        out = ROOT / "public" / "music" / f"{name}.wav"
        write_wav(out, mix)
        print(f"✓ {out.relative_to(ROOT)} ({length:.1f}s)")
