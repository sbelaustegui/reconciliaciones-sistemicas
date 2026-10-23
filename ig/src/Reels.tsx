import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {TransitionPresentation, TransitionSeries, linearTiming, springTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide, SlideDirection} from '@remotion/transitions/slide';
import {wipe, WipeDirection} from '@remotion/transitions/wipe';
import timeline from './reels.json';
import {C, DATES, F, HANDLE, PLACE} from './theme';
import {ArchPhoto, Backdrop, BOUNCY, Center, clamp, CountUp, Kicker, LetterStagger, PAD, PhotoBg, RevealWords, Shine, Strike, useSpring} from './ui';

export const FPS = timeline.fps;
const T = timeline.transition;

type ReelName = keyof typeof timeline.reels;
type SceneFn = (dur: number) => React.ReactNode;

/* ---------- shared scenes ---------- */

const EndCard: SceneFn = () => <EndCardScene />;
const EndCardScene: React.FC = () => {
	const btn = useSpring(50, BOUNCY);
	const info = useSpring(30);
	return (
		<>
			<Backdrop tone="dark" />
			<Center>
				<Kicker color={C.sand}>Formación intensiva residencial</Kicker>
				<LetterStagger text="Reconciliaciones" delay={4} size={104} color={C.bg} perLetter={1} />
				<LetterStagger text="Sistémicas" delay={16} size={104} color={C.bg} perLetter={1} />
				<LetterStagger text="con Caballos" delay={26} size={104} color={C.sand} italic perLetter={1} />
				<div style={{marginTop: 50, opacity: info, transform: `translateY(${(1 - info) * 30}px)`, fontFamily: F.sans, fontSize: 40, lineHeight: 1.6, color: '#d8ccbf'}}>
					{DATES}
					<br />
					{PLACE}
				</div>
				<div
					style={{
						marginTop: 60,
						position: 'relative',
						overflow: 'hidden',
						background: C.terra,
						color: '#fff',
						fontFamily: F.sans,
						fontWeight: 500,
						fontSize: 40,
						padding: '30px 54px',
						borderRadius: 999,
						transform: `scale(${btn})`,
						transformOrigin: 'left center',
					}}
				>
					Info y reservas: link en la bio
					<Shine delay={72} />
				</div>
				<div style={{marginTop: 36, opacity: info, fontFamily: F.sans, fontSize: 32, letterSpacing: '0.12em', color: C.sand}}>{HANDLE}</div>
			</Center>
		</>
	);
};

/** Big word that lands from oversized with a bounce */
const Punch: React.FC<{children: React.ReactNode; delay: number; size?: number; color?: string; italic?: boolean}> = ({children, delay, size = 120, color = C.terra, italic = true}) => {
	const p = useSpring(delay, BOUNCY);
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				fontFamily: F.serif,
				fontWeight: 500,
				fontSize: size,
				lineHeight: 1.1,
				color,
				fontStyle: italic ? 'italic' : 'normal',
				opacity: interpolate(frame - delay, [0, 6], [0, 1], clamp),
				transform: `scale(${1.6 - 0.6 * p})`,
				transformOrigin: 'left center',
			}}
		>
			{children}
		</div>
	);
};

/* ---------- Reel 1: Comprender no basta ---------- */

const hookLines = ['Puedes explicar tu infancia.', 'Describir tus heridas.', 'Identificar tus patrones.'];
const Hook: React.FC = () => {
	const frame = useCurrentFrame();
	const dimmed = interpolate(frame, [110, 130], [1, 0.35], clamp);
	return (
		<>
			<Backdrop tone="dark" />
			<Center>
				{hookLines.map((l, i) => (
					<div key={l} style={{position: 'relative', alignSelf: 'flex-start', marginBottom: 36, opacity: dimmed}}>
						<RevealWords text={l} delay={6 + i * 26} size={90} color={C.bg} />
						<Strike delay={92 + i * 8} />
					</div>
				))}
			</Center>
		</>
	);
};

const reel1: Record<string, SceneFn> = {
	hook: () => <Hook />,
	dinamicas: (d) => (
		<>
			<PhotoBg src="jimena.jpg" dur={d} pos="30% 45%" dim={0.8} />
			<Center justify="flex-end">
				<RevealWords text="Y aun así repetir las mismas dinámicas." delay={8} size={100} color="#fff" accent={[5]} accentColor={C.sand} />
			</Center>
		</>
	),
	experiencia: () => (
		<>
			<Backdrop />
			<Center>
				<RevealWords text="Comprender no siempre transforma." delay={6} size={110} />
				<div style={{marginTop: 50}}>
					<Punch delay={55} size={130}>
						La experiencia sí.
					</Punch>
				</div>
			</Center>
		</>
	),
	cuerpo: (d) => (
		<>
			<Backdrop tone="sand" />
			<Center align="center">
				<ArchPhoto src="maika.jpg" pos="50% 40%" width={720} height={820} delay={4} dur={d} />
				<div style={{marginTop: 60, width: '100%'}}>
					<RevealWords text="El cuerpo y los caballos muestran lo que la palabra no alcanza a nombrar." delay={30} stagger={3} size={66} align="center" accent={[3, 4]} />
				</div>
			</Center>
		</>
	),
	pilares: () => (
		<>
			<Backdrop tone="terra" />
			<Center>
				<Kicker color={C.sand}>Un método, tres pilares</Kicker>
				{['Sistema.', 'Cuerpo.', 'Caballo.'].map((w, i) => (
					<Punch key={w} delay={10 + i * 22} size={170} color={i === 2 ? C.sand : '#fff'} italic={i === 2}>
						{w}
					</Punch>
				))}
			</Center>
		</>
	),
	end: EndCard,
};

/* ---------- Reel 2: El caballo no juzga ---------- */

const reel2: Record<string, SceneFn> = {
	ojo: (d) => (
		<>
			<PhotoBg src="ojo-caballo.jpg" dur={d} from={1.0} to={1.25} dim={0.75} />
			<Center justify="flex-end">
				<RevealWords text="El caballo no analiza." delay={10} size={108} color="#fff" />
				<RevealWords text="No interpreta." delay={55} size={108} color="#fff" />
				<RevealWords text="No juzga." delay={95} size={108} color={C.sand} italic />
			</Center>
		</>
	),
	coherencia: () => (
		<>
			<Backdrop tone="terra" />
			<Center>
				<Kicker color={C.sand} delay={4}>
					Responde a la coherencia entre
				</Kicker>
				<Punch delay={18} size={150} color="#fff" italic={false}>
					intención,
				</Punch>
				<Punch delay={38} size={150} color="#fff" italic={false}>
					emoción
				</Punch>
				<Punch delay={58} size={150} color={C.sand}>
					y presencia.
				</Punch>
			</Center>
		</>
	),
	espejo: (d) => (
		<>
			<Backdrop />
			<Center align="center">
				<ArchPhoto src="jimena.jpg" pos="35% 45%" width={720} height={800} delay={6} dur={d} />
				<div style={{marginTop: 60, width: '100%'}}>
					<RevealWords text="Por eso es un espejo extraordinario de lo que ocurre dentro de ti." delay={30} stagger={3} size={68} align="center" accent={[4]} />
				</div>
			</Center>
		</>
	),
	frase: () => (
		<>
			<Backdrop tone="dark" />
			<Center>
				<Kicker color={C.sand} delay={2}>
					El caballo como espejo
				</Kicker>
				<RevealWords text="“El caballo muestra lo que la palabra no puede nombrar.”" delay={8} stagger={4} size={104} color={C.bg} accent={[6, 7, 8, 9]} accentColor={C.sand} />
			</Center>
		</>
	),
	end: EndCard,
};

/* ---------- Reel 3: Anuncio ---------- */

const Days: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<div style={{display: 'flex', gap: 22, marginTop: 70}}>
			{[16, 17, 18, 19, 20, 21].map((d, i) => {
				const on = interpolate(frame - (30 + i * 6), [0, 6], [0, 1], clamp);
				return (
					<div
						key={d}
						style={{
							width: 118,
							height: 118,
							borderRadius: 24,
							display: 'grid',
							placeItems: 'center',
							fontFamily: F.serif,
							fontSize: 50,
							border: `3px solid ${C.terra}`,
							background: on > 0.5 ? C.terra : 'transparent',
							color: on > 0.5 ? '#fff' : C.terra,
							transform: `scale(${1 + Math.sin(on * Math.PI) * 0.15})`,
						}}
					>
						{d}
					</div>
				);
			})}
		</div>
	);
};

const Portrait: React.FC<{src: string; pos: string; name: string; org: string; delay: number; dur: number; fromLeft?: boolean}> = ({src, pos, name, org, delay, dur, fromLeft}) => {
	const p = useSpring(delay, {damping: 15, stiffness: 100});
	const n = useSpring(delay + 22);
	return (
		<div style={{width: 400, transform: `translateX(${(1 - p) * (fromLeft ? -500 : 500)}px) rotate(${(1 - p) * (fromLeft ? -8 : 8)}deg)`}}>
			<ArchPhoto src={src} pos={pos} width={400} height={540} delay={delay} dur={dur} />
			<div style={{opacity: n, transform: `translateY(${(1 - n) * 20}px)`}}>
				<div style={{fontFamily: F.serif, fontSize: 48, color: C.ink, marginTop: 30}}>{name}</div>
				<div style={{fontFamily: F.sans, fontSize: 28, color: C.muted, marginTop: 6}}>{org}</div>
			</div>
		</div>
	);
};

const includes = ['Formación intensiva', 'Trabajo con caballos', 'Alojamiento', 'Pensión completa', 'Certificado'];
const Check: React.FC<{delay: number}> = ({delay}) => {
	const frame = useCurrentFrame();
	const draw = interpolate(frame - delay - 6, [0, 10], [0, 1], clamp);
	return (
		<svg width="56" height="56" viewBox="0 0 24 24" fill="none">
			<circle cx="12" cy="12" r="11" fill={C.terra} />
			<path d="M7 12.5l3.2 3.2L17 9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
		</svg>
	);
};
const IncludeRow: React.FC<{label: string; delay: number}> = ({label, delay}) => {
	const p = useSpring(delay, BOUNCY);
	return (
		<div style={{display: 'flex', alignItems: 'center', gap: 30, padding: '22px 0', opacity: Math.min(1, p * 1.5), transform: `translateX(${(1 - p) * 80}px)`}}>
			<Check delay={delay} />
			<span style={{fontFamily: F.serif, fontSize: 70, color: C.bg}}>{label}</span>
		</div>
	);
};

const Price: React.FC = () => {
	const badge = useSpring(62, BOUNCY);
	const frame = useCurrentFrame();
	const oldFade = interpolate(frame, [36, 50], [1, 0.4], clamp);
	return (
		<>
			<Backdrop />
			<Center>
				<Kicker delay={2}>Inversión</Kicker>
				<div style={{position: 'relative', alignSelf: 'flex-start', opacity: oldFade}}>
					<RevealWords text="USD 1.350" delay={6} size={90} color={C.ink2} />
					<Strike delay={30} color={C.terra} />
				</div>
				<div style={{marginTop: 30}}>
					<Punch delay={42} size={170} color={C.ink} italic={false}>
						<span style={{whiteSpace: 'nowrap'}}>USD 1.200</span>
					</Punch>
				</div>
				<div
					style={{
						marginTop: 40,
						alignSelf: 'flex-start',
						background: C.terra,
						color: '#fff',
						fontFamily: F.sans,
						fontWeight: 600,
						fontSize: 30,
						letterSpacing: '0.16em',
						textTransform: 'uppercase',
						padding: '16px 32px',
						borderRadius: 999,
						transform: `scale(${badge})`,
						transformOrigin: 'left center',
					}}
				>
					Pago anticipado · Ahorras USD 150
				</div>
				<div style={{marginTop: 40, opacity: badge}}>
					<RevealWords text="Plazas limitadas." delay={74} size={56} color={C.terra} italic />
				</div>
			</Center>
		</>
	);
};

const reel3: Record<string, SceneFn> = {
	intro: (d) => (
		<>
			<PhotoBg src="hero-caballo.jpg" dur={d} dim={0.75} />
			<Center justify="flex-end">
				<Kicker color={C.sand} delay={6}>
					Inscripciones abiertas
				</Kicker>
				<LetterStagger text="Reconciliaciones" delay={14} size={108} color="#fff" perLetter={1} />
				<LetterStagger text="Sistémicas" delay={26} size={108} color="#fff" perLetter={1} />
				<LetterStagger text="con Caballos" delay={36} size={108} color={C.sand} italic perLetter={1} />
			</Center>
		</>
	),
	dias: () => (
		<>
			<Backdrop />
			<Center>
				<div style={{fontFamily: F.serif, fontSize: 300, lineHeight: 1, color: C.terra}}>
					<CountUp to={6} delay={8} dur={30} />
					<span style={{fontSize: 140, fontStyle: 'italic'}}> días</span>
				</div>
				<div style={{marginTop: 40}}>
					<RevealWords text="de inmersión en la naturaleza, con caballos." delay={40} stagger={3} size={78} />
				</div>
			</Center>
		</>
	),
	fechas: () => (
		<>
			<Backdrop tone="sand" />
			<Center>
				<Kicker delay={2}>Cuándo y dónde</Kicker>
				<RevealWords text="Febrero de 2027" delay={6} size={110} />
				<Days />
				<div style={{marginTop: 70}}>
					<RevealWords text={PLACE} delay={66} stagger={3} size={44} color={C.ink2} font="sans" />
				</div>
			</Center>
		</>
	),
	equipo: (d) => (
		<>
			<Backdrop />
			<Center>
				<Kicker delay={2}>Te acompañan</Kicker>
				<div style={{display: 'flex', gap: 80, marginTop: 10}}>
					<Portrait src="jimena.jpg" pos="55% 45%" name="Jimena Marchisio" org="MindCompass" delay={8} dur={d} fromLeft />
					<Portrait src="maika.jpg" pos="50% 45%" name="Maika Castillo" org="Sentir Caballos" delay={20} dur={d} />
				</div>
			</Center>
		</>
	),
	incluye: () => (
		<>
			<Backdrop tone="dark" />
			<Center>
				<Kicker color={C.sand} delay={2}>
					Incluye
				</Kicker>
				{includes.map((l, i) => (
					<IncludeRow key={l} label={l} delay={14 + i * 12} />
				))}
			</Center>
		</>
	),
	precio: () => <Price />,
	end: EndCard,
};

/* ---------- Reel 4: Los 6 principios ---------- */

const principles = [
	'La realidad precede a la transformación',
	'La vida se recibe',
	'Lo que rechazo fuera aparece dentro',
	'El cuerpo expresa lo que la mente desconoce',
	'La transformación ocurre en la experiencia',
	'El caballo como facilitador fenomenológico',
];

const Progress: React.FC<{active: number}> = ({active}) => {
	const frame = useCurrentFrame();
	const fill = interpolate(frame, [0, 90], [0, 1], clamp);
	return (
		<div style={{position: 'absolute', top: SAFE_TOP_PROGRESS, left: PAD, right: PAD, display: 'flex', gap: 14}}>
			{principles.map((_, i) => (
				<div key={i} style={{flex: 1, height: 6, borderRadius: 3, background: 'rgba(168,85,58,.2)', overflow: 'hidden'}}>
					<div style={{height: '100%', width: `${i < active ? 100 : i === active ? fill * 100 : 0}%`, background: C.terra}} />
				</div>
			))}
		</div>
	);
};
const SAFE_TOP_PROGRESS = 250;

const TiltCard: React.FC<{src: string; delay: number; dur: number}> = ({src, delay, dur}) => {
	const p = useSpring(delay, {damping: 16, stiffness: 90});
	const frame = useCurrentFrame();
	const drift = interpolate(frame, [0, dur], [1, 1.04]);
	const w = 1080 - PAD * 2;
	const h = (w * 768) / 1376;
	return (
		<div style={{perspective: 1800}}>
			<div
				style={{
					width: w,
					height: h * 0.95,
					overflow: 'hidden',
					borderRadius: 24,
					position: 'relative',
					boxShadow: '0 60px 100px -50px rgba(80,40,20,.7)',
					opacity: p,
					transform: `rotateX(${(1 - p) * 35}deg) translateY(${(1 - p) * 120}px) scale(${drift})`,
					transformOrigin: 'center bottom',
				}}
			>
				{/* the presentation slides carry a small watermark in the bottom-right corner; crop it out */}
				<Img src={staticFile(src)} style={{width: w * 1.04, height: h * 1.04}} />
				<Shine delay={delay + 18} />
			</div>
		</div>
	);
};

const PrincipleScene: React.FC<{i: number; dur: number}> = ({i, dur}) => {
	const n = useSpring(4, BOUNCY);
	return (
		<>
			<Backdrop tone={i % 2 ? 'sand' : 'cream'} />
			<Progress active={i} />
			<Center>
				<div style={{fontFamily: F.serif, fontSize: 170, lineHeight: 1, color: C.terra2, transform: `scale(${n})`, transformOrigin: 'left bottom'}}>{i + 1}</div>
				<div style={{marginTop: 24, marginBottom: 70}}>
					<RevealWords text={principles[i]} delay={12} stagger={3} size={80} />
				</div>
				<TiltCard src={`slide-p${i + 1}.jpg`} delay={28} dur={dur} />
			</Center>
		</>
	);
};

const reel4: Record<string, SceneFn> = {
	intro: () => (
		<>
			<Backdrop />
			<Center>
				<Kicker delay={2}>Reconciliaciones Sistémicas con Caballos</Kicker>
				<LetterStagger text="Los 6 principios" delay={8} size={130} perLetter={1.1} />
				<Punch delay={30} size={130}>
					del método.
				</Punch>
			</Center>
		</>
	),
	...Object.fromEntries(principles.map((_, i) => [`p${i + 1}`, (d: number) => <PrincipleScene i={i} dur={d} />])),
	end: EndCard,
};

/* ---------- assembly ---------- */

const registry: Record<ReelName, Record<string, SceneFn>> = {
	'1-comprender': reel1,
	'2-caballo': reel2,
	'3-anuncio': reel3,
	'4-principios': reel4,
};

const presentation = (spec: string): TransitionPresentation<Record<string, unknown>> => {
	const [kind, dir] = spec.split(':');
	if (kind === 'slide') return slide({direction: dir as SlideDirection}) as TransitionPresentation<Record<string, unknown>>;
	if (kind === 'wipe') return wipe({direction: dir as WipeDirection}) as TransitionPresentation<Record<string, unknown>>;
	return fade() as TransitionPresentation<Record<string, unknown>>;
};

export const reelNames = Object.keys(timeline.reels) as ReelName[];

export const reelDuration = (name: ReelName) => {
	const {scenes} = timeline.reels[name];
	return scenes.reduce((a, s) => a + s.frames, 0) - T * (scenes.length - 1);
};

const Soundtrack: React.FC<{name: ReelName}> = ({name}) => {
	const {durationInFrames} = useVideoConfig();
	return (
		<Audio
			src={staticFile(`music/${name}.wav`)}
			volume={(f) => interpolate(f, [0, 8, durationInFrames - 30, durationInFrames], [0, 1, 1, 0], {...clamp, easing: Easing.inOut(Easing.quad)})}
		/>
	);
};

export const Reel: React.FC<{name: ReelName}> = ({name}) => {
	const {scenes, transitions} = timeline.reels[name];
	const scenesFns = registry[name];
	return (
		<AbsoluteFill style={{background: C.ink}}>
			<Soundtrack name={name} />
			<TransitionSeries>
				{scenes.flatMap((s, i) => {
					const items = [
						<TransitionSeries.Sequence key={`s${i}`} durationInFrames={s.frames}>
							{scenesFns[s.id](s.frames)}
						</TransitionSeries.Sequence>,
					];
					if (i < transitions.length) {
						const first = i === 0 || i === transitions.length - 1;
						items.push(
							<TransitionSeries.Transition
								key={`t${i}`}
								presentation={presentation(transitions[i])}
								timing={first ? linearTiming({durationInFrames: T}) : springTiming({durationInFrames: T, config: {damping: 200}})}
							/>,
						);
					}
					return items;
				})}
			</TransitionSeries>
		</AbsoluteFill>
	);
};
