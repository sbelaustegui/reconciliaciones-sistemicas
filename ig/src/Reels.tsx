import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, DATES, F, HANDLE, PLACE, TITLE, Tone, toneColors} from './theme';
import {Wash} from './Post';

export const FPS = 30;
const s = (sec: number) => Math.round(sec * FPS);
// Instagram covers roughly the top 220px and bottom 380px of a reel with UI
const SAFE_TOP = 260;
const SAFE_BOTTOM = 420;
const PAD = 100;

const ease = Easing.bezier(0.22, 1, 0.36, 1);

const useFade = (dur: number, edge = 12) => {
	const f = useCurrentFrame();
	return interpolate(f, [0, edge, dur - edge, dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
};

const Rise: React.FC<{delay?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({delay = 0, children, style}) => {
	const f = useCurrentFrame() - delay;
	const p = interpolate(f, [0, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
	return <div style={{opacity: p, transform: `translateY(${(1 - p) * 40}px)`, ...style}}>{children}</div>;
};

const KenBurns: React.FC<{src: string; dur: number; pos?: string; from?: number; to?: number; dim?: number}> = ({src, dur, pos = 'center', from = 1.04, to = 1.16, dim = 0}) => {
	const f = useCurrentFrame();
	const sc = interpolate(f, [0, dur], [from, to]);
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${sc})`}} />
			{dim > 0 && <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(30,22,16,${dim * 0.5}) 0%, rgba(30,22,16,${dim}) 100%)`}} />}
		</AbsoluteFill>
	);
};

type SceneProps = {from: number; dur: number; children: React.ReactNode; fade?: boolean};
const Scene: React.FC<SceneProps> = ({from, dur, children}) => (
	<Sequence from={from} durationInFrames={dur}>
		<FadeWrap dur={dur}>{children}</FadeWrap>
	</Sequence>
);
const FadeWrap: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
	const o = useFade(dur);
	return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

const Bg: React.FC<{tone?: Tone}> = ({tone = 'cream'}) => (
	<AbsoluteFill style={{background: toneColors[tone].bg}}>
		<Wash tone={tone} />
	</AbsoluteFill>
);

const Center: React.FC<{children: React.ReactNode; align?: 'center' | 'flex-end'}> = ({children, align = 'center'}) => (
	<AbsoluteFill style={{padding: `${SAFE_TOP}px ${PAD}px ${SAFE_BOTTOM}px`, justifyContent: align}}>{children}</AbsoluteFill>
);

const Big: React.FC<{children: React.ReactNode; color?: string; size?: number; italic?: boolean}> = ({children, color = C.ink, size = 96, italic}) => (
	<div style={{fontFamily: F.serif, fontWeight: 500, fontSize: size, lineHeight: 1.15, color, fontStyle: italic ? 'italic' : 'normal'}}>{children}</div>
);

const Eyebrow: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = C.terra}) => (
	<div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 28, letterSpacing: '0.22em', textTransform: 'uppercase', color, marginBottom: 36}}>{children}</div>
);

const Small: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = C.ink2, size = 40}) => (
	<div style={{fontFamily: F.sans, fontSize: size, lineHeight: 1.5, color}}>{children}</div>
);

const EndCard: React.FC<{dur: number}> = () => (
	<>
		<Bg tone="dark" />
		<Center>
			<Rise>
				<Eyebrow color={C.sand}>Formación intensiva residencial</Eyebrow>
			</Rise>
			<Rise delay={6}>
				<Big color={C.bg} size={100}>{TITLE}</Big>
			</Rise>
			<Rise delay={14}>
				<div style={{marginTop: 56}}>
					<Small color="#d8ccbf" size={42}>
						{DATES}
						<br />
						{PLACE}
					</Small>
				</div>
			</Rise>
			<Rise delay={24}>
				<div style={{marginTop: 70, display: 'inline-block', background: C.terra, color: '#fff', fontFamily: F.sans, fontWeight: 500, fontSize: 40, padding: '30px 52px', borderRadius: 999}}>
					Info y reservas: link en la bio
				</div>
			</Rise>
			<Rise delay={30}>
				<div style={{marginTop: 40, fontFamily: F.sans, fontSize: 32, letterSpacing: '0.12em', color: C.sand}}>{HANDLE}</div>
			</Rise>
		</Center>
	</>
);

type Beat = {dur: number; render: (dur: number) => React.ReactNode};

const Timeline: React.FC<{beats: Beat[]}> = ({beats}) => {
	let t = 0;
	return (
		<AbsoluteFill style={{background: C.ink}}>
			{beats.map((b, i) => {
				const from = t;
				t += b.dur;
				return (
					<Scene key={i} from={from} dur={b.dur}>
						{b.render(b.dur)}
					</Scene>
				);
			})}
		</AbsoluteFill>
	);
};

export const totalFrames = (beats: Beat[]) => beats.reduce((a, b) => a + b.dur, 0);

/* ---------- Reel 1: Comprender no basta ---------- */
export const reel1: Beat[] = [
	{
		dur: s(3.2),
		render: (d) => (
			<>
				<KenBurns src="jimena.jpg" dur={d} pos="30% 45%" dim={0.75} />
				<Center align="flex-end">
					<Rise>
						<Big color="#fff" size={92}>Puedes explicar tu infancia.</Big>
					</Rise>
				</Center>
			</>
		),
	},
	{
		dur: s(2.6),
		render: (d) => (
			<>
				<KenBurns src="hero-caballo.jpg" dur={d} dim={0.75} />
				<Center align="flex-end">
					<Rise>
						<Big color="#fff" size={92}>Describir tus heridas.</Big>
					</Rise>
				</Center>
			</>
		),
	},
	{
		dur: s(2.6),
		render: (d) => (
			<>
				<KenBurns src="ojo-caballo.jpg" dur={d} dim={0.75} />
				<Center align="flex-end">
					<Rise>
						<Big color="#fff" size={92}>Identificar tus patrones.</Big>
					</Rise>
				</Center>
			</>
		),
	},
	{
		dur: s(3.4),
		render: () => (
			<>
				<Bg tone="dark" />
				<Center>
					<Rise>
						<Big color={C.bg} size={96}>Y aun así repetir las mismas dinámicas.</Big>
					</Rise>
				</Center>
			</>
		),
	},
	{
		dur: s(3.6),
		render: () => (
			<>
				<Bg />
				<Center>
					<Rise>
						<Big size={104}>Comprender no siempre transforma.</Big>
					</Rise>
					<Rise delay={30}>
						<div style={{marginTop: 40}}>
							<Big size={104} color={C.terra} italic>
								La experiencia sí.
							</Big>
						</div>
					</Rise>
				</Center>
			</>
		),
	},
	{
		dur: s(4),
		render: (d) => (
			<>
				<KenBurns src="maika.jpg" dur={d} pos="50% 35%" dim={0.7} />
				<Center align="flex-end">
					<Rise>
						<Big color="#fff" size={80}>El cuerpo y los caballos muestran lo que la palabra no alcanza a nombrar.</Big>
					</Rise>
				</Center>
			</>
		),
	},
	{dur: s(5), render: (d) => <EndCard dur={d} />},
];

/* ---------- Reel 2: El caballo no juzga ---------- */
const horseLines = ['El caballo no analiza.', 'No interpreta.', 'No juzga.'];
export const reel2: Beat[] = [
	{
		dur: s(7),
		render: (d) => (
			<>
				<KenBurns src="ojo-caballo.jpg" dur={d} from={1.0} to={1.2} dim={0.7} />
				<Center align="flex-end">
					{horseLines.map((l, i) => (
						<Rise key={l} delay={10 + i * 40}>
							<Big color="#fff" size={104}>{l}</Big>
						</Rise>
					))}
				</Center>
			</>
		),
	},
	{
		dur: s(4.2),
		render: () => (
			<>
				<Bg tone="terra" />
				<Center>
					<Rise>
						<Small color="#f8e6da" size={44}>Responde a la coherencia entre</Small>
					</Rise>
					<Rise delay={12}>
						<div style={{marginTop: 20}}>
							<Big color="#fff" size={104}>intención, emoción y presencia.</Big>
						</div>
					</Rise>
				</Center>
			</>
		),
	},
	{
		dur: s(4.2),
		render: (d) => (
			<>
				<KenBurns src="jimena.jpg" dur={d} pos="25% 45%" dim={0.7} />
				<Center align="flex-end">
					<Rise>
						<Big color="#fff" size={88} italic>
							Por eso es un espejo extraordinario de lo que ocurre dentro de ti.
						</Big>
					</Rise>
				</Center>
			</>
		),
	},
	{dur: s(5), render: (d) => <EndCard dur={d} />},
];

/* ---------- Reel 3: Anuncio de la formación ---------- */
const Portrait: React.FC<{src: string; pos: string; name: string; org: string}> = ({src, pos, name, org}) => (
	<div style={{width: 400}}>
		<Img src={staticFile(src)} style={{width: 400, height: 520, objectFit: 'cover', objectPosition: pos, borderRadius: '200px 200px 18px 18px'}} />
		<div style={{fontFamily: F.serif, fontSize: 46, color: C.ink, marginTop: 26}}>{name}</div>
		<div style={{fontFamily: F.sans, fontSize: 26, color: C.muted, marginTop: 6}}>{org}</div>
	</div>
);

export const reel3: Beat[] = [
	{
		dur: s(4),
		render: (d) => (
			<>
				<KenBurns src="hero-caballo.jpg" dur={d} dim={0.7} />
				<Center align="flex-end">
					<Rise>
						<Eyebrow color={C.sand}>Inscripciones abiertas</Eyebrow>
					</Rise>
					<Rise delay={8}>
						<Big color="#fff" size={100}>{TITLE}</Big>
					</Rise>
				</Center>
			</>
		),
	},
	{
		dur: s(3.4),
		render: () => (
			<>
				<Bg />
				<Center>
					<Rise>
						<Big size={220} color={C.terra}>6 días</Big>
					</Rise>
					<Rise delay={10}>
						<Big size={76}>de inmersión en la naturaleza, con caballos.</Big>
					</Rise>
				</Center>
			</>
		),
	},
	{
		dur: s(3.6),
		render: () => (
			<>
				<Bg tone="sand" />
				<Center>
					<Rise>
						<Eyebrow>Cuándo y dónde</Eyebrow>
					</Rise>
					<Rise delay={6}>
						<Big size={100}>16 al 21 de febrero de 2027</Big>
					</Rise>
					<Rise delay={18}>
						<div style={{marginTop: 30}}>
							<Small size={46}>{PLACE}</Small>
						</div>
					</Rise>
				</Center>
			</>
		),
	},
	{
		dur: s(4.4),
		render: () => (
			<>
				<Bg />
				<Center>
					<Rise>
						<Eyebrow>Te acompañan</Eyebrow>
					</Rise>
					<div style={{display: 'flex', gap: 80, marginTop: 20}}>
						<Rise delay={6}>
							<Portrait src="jimena.jpg" pos="55% 45%" name="Jimena Marchisio" org="MindCompass" />
						</Rise>
						<Rise delay={16}>
							<Portrait src="maika.jpg" pos="50% 45%" name="Maika Castillo" org="Sentir Caballos" />
						</Rise>
					</div>
				</Center>
			</>
		),
	},
	{
		dur: s(4),
		render: () => (
			<>
				<Bg tone="dark" />
				<Center>
					<Rise>
						<Eyebrow color={C.sand}>Incluye</Eyebrow>
					</Rise>
					{['Formación intensiva', 'Trabajo con caballos', 'Alojamiento', 'Pensión completa', 'Certificado'].map((l, i) => (
						<Rise key={l} delay={6 + i * 7}>
							<Big color={C.bg} size={78}>{l}</Big>
						</Rise>
					))}
				</Center>
			</>
		),
	},
	{
		dur: s(3.8),
		render: () => (
			<>
				<Bg />
				<Center>
					<Rise>
						<Eyebrow>Pago anticipado</Eyebrow>
					</Rise>
					<Rise delay={6}>
						<Big size={170}>USD 1.200</Big>
					</Rise>
					<Rise delay={16}>
						<div style={{marginTop: 24}}>
							<Small size={44}>Valor general USD 1.350 · Plazas limitadas</Small>
						</div>
					</Rise>
				</Center>
			</>
		),
	},
	{dur: s(5), render: (d) => <EndCard dur={d} />},
];

/* ---------- Reel 4: Los 6 principios ---------- */
const principles = [
	'La realidad precede a la transformación',
	'La vida se recibe',
	'Lo que rechazo fuera aparece dentro',
	'El cuerpo expresa lo que la mente desconoce',
	'La transformación ocurre en la experiencia',
	'El caballo como facilitador fenomenológico',
];

const SlideCard: React.FC<{src: string; dur: number}> = ({src, dur}) => {
	const f = useCurrentFrame();
	const sc = interpolate(f, [0, dur], [1, 1.05]);
	const w = 1080 - PAD * 2;
	const h = (w * 768) / 1376;
	return (
		<div style={{width: w, height: h * 0.95, overflow: 'hidden', borderRadius: 22, boxShadow: '0 50px 90px -40px rgba(80,40,20,.6)', transform: `scale(${sc})`}}>
			<Img src={staticFile(src)} style={{width: w * 1.04, height: h * 1.04}} />
		</div>
	);
};

export const reel4: Beat[] = [
	{
		dur: s(3.2),
		render: () => (
			<>
				<Bg />
				<Center>
					<Rise>
						<Eyebrow>Reconciliaciones Sistémicas con Caballos</Eyebrow>
					</Rise>
					<Rise delay={6}>
						<Big size={124}>
							Los 6 principios <span style={{fontStyle: 'italic', color: C.terra}}>del método</span>
						</Big>
					</Rise>
				</Center>
			</>
		),
	},
	...principles.map(
		(p, i): Beat => ({
			dur: s(3.4),
			render: (d) => (
				<>
					<Bg tone={i % 2 ? 'sand' : 'cream'} />
					<Center>
						<Rise>
							<div style={{fontFamily: F.serif, fontSize: 150, lineHeight: 1, color: C.terra2}}>{i + 1}</div>
						</Rise>
						<Rise delay={4}>
							<div style={{marginTop: 20, marginBottom: 60}}>
								<Big size={80}>{p}</Big>
							</div>
						</Rise>
						<Rise delay={12}>
							<SlideCard src={`slide-p${i + 1}.jpg`} dur={d} />
						</Rise>
					</Center>
				</>
			),
		}),
	),
	{dur: s(5), render: (d) => <EndCard dur={d} />},
];

export const reels: Record<string, Beat[]> = {
	'1-comprender': reel1,
	'2-caballo': reel2,
	'3-anuncio': reel3,
	'4-principios': reel4,
};

export const Reel: React.FC<{name: string}> = ({name}) => <Timeline beats={reels[name]} />;
