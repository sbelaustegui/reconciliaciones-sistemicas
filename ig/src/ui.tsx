// Animation helpers for the reels (adapted from the corecontent/corecapital promos, in a warmer, slower register)
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F, Tone, toneColors} from './theme';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type SpringCfg = {damping?: number; stiffness?: number; mass?: number};
export const SOFT: SpringCfg = {damping: 16, stiffness: 110};
export const BOUNCY: SpringCfg = {damping: 10, stiffness: 150};

export const useSpring = (delay = 0, config: SpringCfg = SOFT) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return spring({frame: frame - delay, fps, config});
};

// Instagram covers roughly the top 220px and bottom 380px of a reel with UI
export const SAFE_TOP = 260;
export const SAFE_BOTTOM = 440;
export const PAD = 100;

/* ---------- backgrounds ---------- */

const Blob: React.FC<{color: string; size: number; x: number; y: number; phase: number}> = ({color, size, x, y, phase}) => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				position: 'absolute',
				left: x + Math.sin(frame / 50 + phase) * 70,
				top: y + Math.cos(frame / 65 + phase) * 90,
				width: size,
				height: size,
				borderRadius: '50%',
				background: color,
				filter: 'blur(140px)',
				opacity: 0.55,
			}}
		/>
	);
};

export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.09}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
			<svg width="100%" height="100%">
				<filter id="grain">
					<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={frame % 8} />
				</filter>
				<rect width="100%" height="100%" filter="url(#grain)" />
			</svg>
		</AbsoluteFill>
	);
};

const blobColors: Record<Tone, [string, string]> = {
	cream: ['#e2b48f', '#ecd3b5'],
	sand: ['#d79a74', '#f1dcc2'],
	dark: ['#6b3b28', '#4a3a30'],
	terra: ['#d27c55', '#7d3523'],
};

export const Backdrop: React.FC<{tone?: Tone}> = ({tone = 'cream'}) => {
	const [a, b] = blobColors[tone];
	return (
		<AbsoluteFill style={{background: toneColors[tone].bg, overflow: 'hidden'}}>
			<Blob color={a} size={900} x={-380} y={1150} phase={0} />
			<Blob color={b} size={760} x={560} y={-260} phase={2} />
			<Grain />
		</AbsoluteFill>
	);
};

/** Specks of dust floating up through warm light */
export const Dust: React.FC<{count?: number}> = ({count = 26}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{Array.from({length: count}).map((_, i) => {
				const x = random(`x${i}`) * 1080;
				const speed = 0.6 + random(`s${i}`) * 1.4;
				const y = 1920 - ((random(`y${i}`) * 1920 + frame * speed) % 2100);
				const size = 3 + random(`r${i}`) * 7;
				const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame / 20 + i));
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x + Math.sin(frame / 30 + i) * 18,
							top: y,
							width: size,
							height: size,
							borderRadius: '50%',
							background: '#fff3df',
							opacity: 0.55 * tw,
							filter: 'blur(1.5px)',
							boxShadow: '0 0 12px rgba(255,230,190,.9)',
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

export const PhotoBg: React.FC<{src: string; dur: number; pos?: string; from?: number; to?: number; dim?: number; dust?: boolean}> = ({
	src,
	dur,
	pos = 'center',
	from = 1.06,
	to = 1.18,
	dim = 0.7,
	dust = true,
}) => {
	const frame = useCurrentFrame();
	const sc = interpolate(frame, [0, dur], [from, to]);
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: C.ink}}>
			<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${sc})`}} />
			<AbsoluteFill style={{background: `linear-gradient(180deg, rgba(30,22,16,${dim * 0.35}) 0%, rgba(30,22,16,${dim * 0.55}) 45%, rgba(30,22,16,${dim}) 100%)`}} />
			{dust && <Dust />}
			<Grain opacity={0.12} />
		</AbsoluteFill>
	);
};

/* ---------- text ---------- */

/** Words rise one by one, from blurred to sharp */
export const RevealWords: React.FC<{
	text: string;
	delay?: number;
	stagger?: number;
	size?: number;
	color?: string;
	italic?: boolean;
	accent?: number[];
	accentColor?: string;
	align?: 'left' | 'center';
	font?: 'serif' | 'sans';
}> = ({text, delay = 0, stagger = 4, size = 96, color = C.ink, italic, accent = [], accentColor = C.terra, align = 'left', font = 'serif'}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: align === 'center' ? 'center' : 'flex-start',
				gap: '0 0.26em',
				fontFamily: font === 'serif' ? F.serif : F.sans,
				fontWeight: font === 'serif' ? 500 : 400,
				fontSize: size,
				lineHeight: 1.16,
				color,
				fontStyle: italic ? 'italic' : 'normal',
			}}
		>
			{text.split(' ').map((w, i) => {
				const p = spring({frame: frame - delay - i * stagger, fps, config: {damping: 18, stiffness: 120}});
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							opacity: p,
							transform: `translateY(${(1 - p) * 50}px)`,
							filter: `blur(${(1 - p) * 14}px)`,
							color: accent.includes(i) ? accentColor : undefined,
							fontStyle: accent.includes(i) ? 'italic' : undefined,
						}}
					>
						{w}
					</span>
				);
			})}
		</div>
	);
};

/** Eyebrow label with a short line that draws in before it */
export const Kicker: React.FC<{children: React.ReactNode; delay?: number; color?: string}> = ({children, delay = 0, color = C.terra}) => {
	const p = useSpring(delay);
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 22, marginBottom: 40, opacity: Math.min(1, p * 1.4)}}>
			<span style={{height: 3, width: 70 * p, background: color, borderRadius: 2}} />
			<span style={{fontFamily: F.sans, fontWeight: 600, fontSize: 28, letterSpacing: '0.24em', textTransform: 'uppercase', color, transform: `translateX(${(1 - p) * -20}px)`}}>
				{children}
			</span>
		</div>
	);
};

/** Letters drop in one at a time with a soft overshoot */
export const LetterStagger: React.FC<{text: string; delay?: number; size?: number; color?: string; italic?: boolean; perLetter?: number}> = ({
	text,
	delay = 0,
	size = 110,
	color = C.ink,
	italic,
	perLetter = 1.2,
}) => {
	const frame = useCurrentFrame();
	return (
		<div style={{fontFamily: F.serif, fontWeight: 500, fontSize: size, lineHeight: 1.1, color, fontStyle: italic ? 'italic' : 'normal'}}>
			{/* letters animate one by one, but each word stays unbreakable */}
			{text.split(' ').map((word, wi, words) => {
				const offset = words.slice(0, wi).join(' ').length + (wi ? 1 : 0);
				return (
					<span key={wi} style={{display: 'inline-block', whiteSpace: 'nowrap', marginRight: wi < words.length - 1 ? '0.26em' : 0}}>
						{word.split('').map((ch, ci) => {
							const p = interpolate(frame - delay - (offset + ci) * perLetter, [0, 14], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.8))});
							return (
								<span key={ci} style={{display: 'inline-block', opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 40}px)`, filter: `blur(${(1 - Math.min(1, p)) * 6}px)`}}>
									{ch}
								</span>
							);
						})}
					</span>
				);
			})}
		</div>
	);
};

/** A line that strikes through its container */
export const Strike: React.FC<{delay: number; color?: string}> = ({delay, color = C.terra2}) => {
	const frame = useCurrentFrame();
	const w = interpolate(frame - delay, [0, 12], [0, 104], {...clamp, easing: Easing.out(Easing.cubic)});
	return <div style={{position: 'absolute', left: '-2%', top: '54%', height: 7, width: `${w}%`, background: color, borderRadius: 4}} />;
};

export const CountUp: React.FC<{to: number; delay?: number; dur?: number; format?: (n: number) => string; style?: React.CSSProperties}> = ({
	to,
	delay = 0,
	dur = 30,
	format = (n) => String(n),
	style,
}) => {
	const frame = useCurrentFrame();
	const v = interpolate(frame - delay, [0, dur], [1, to], {...clamp, easing: Easing.out(Easing.exp)});
	return <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>{format(Math.round(v))}</span>;
};

/** Diagonal light sweep across its parent */
export const Shine: React.FC<{delay: number}> = ({delay}) => {
	const frame = useCurrentFrame();
	const x = interpolate(frame - delay, [0, 26], [-60, 160], clamp);
	return (
		<div
			style={{
				position: 'absolute',
				inset: 0,
				background: `linear-gradient(105deg, transparent ${x - 25}%, rgba(255,255,255,.45) ${x}%, transparent ${x + 25}%)`,
				mixBlendMode: 'soft-light',
				pointerEvents: 'none',
			}}
		/>
	);
};

/** Photo inside an arch that rises and opens from the bottom */
export const ArchPhoto: React.FC<{src: string; pos?: string; width: number; height: number; delay?: number; dur: number}> = ({src, pos = 'center', width, height, delay = 0, dur}) => {
	const frame = useCurrentFrame();
	const p = useSpring(delay, {damping: 20, stiffness: 90});
	const sc = interpolate(frame, [0, dur], [1.12, 1.0]);
	return (
		<div
			style={{
				width,
				height,
				overflow: 'hidden',
				borderRadius: `${width / 2}px ${width / 2}px 22px 22px`,
				clipPath: `inset(${(1 - p) * 100}% 0 0 0 round ${width / 2}px ${width / 2}px 22px 22px)`,
				transform: `translateY(${(1 - p) * 80}px)`,
				boxShadow: '0 50px 90px -40px rgba(60,30,15,.6)',
				position: 'relative',
			}}
		>
			<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${sc})`}} />
		</div>
	);
};

export const Center: React.FC<{children: React.ReactNode; justify?: 'center' | 'flex-end' | 'flex-start'; align?: 'flex-start' | 'center'}> = ({
	children,
	justify = 'center',
	align = 'flex-start',
}) => <AbsoluteFill style={{padding: `${SAFE_TOP}px ${PAD}px ${SAFE_BOTTOM}px`, justifyContent: justify, alignItems: align}}>{children}</AbsoluteFill>;
