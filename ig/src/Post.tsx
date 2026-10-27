import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, DATES, F, HANDLE, PLACE, TITLE, Tone, toneColors} from './theme';

export type Slide =
	| {kind: 'cover'; eyebrow?: string; title: string; italic?: string; sub?: string; photo?: string; photoPos?: string}
	| {kind: 'statement'; eyebrow?: string; title: string; body?: string[]; tone?: Tone; size?: number}
	| {kind: 'photo'; photo: string; photoPos?: string; eyebrow?: string; title: string; body?: string; size?: number}
	| {kind: 'list'; eyebrow?: string; title: string; items: string[]; tone?: Tone; chips?: boolean}
	| {kind: 'principle'; n: number; title: string; body: string[]; tone?: Tone}
	| {kind: 'image'; eyebrow?: string; title: string; image: string; body?: string}
	| {kind: 'person'; photo: string; photoPos?: string; role: string; name: string; org: string; body: string}
	| {kind: 'price'}
	| {kind: 'cta'; title?: string};

export type PostProps = {slide: Slide; index: number; total: number};

const PAD = 96;

const Eyebrow: React.FC<{children: React.ReactNode; color: string}> = ({children, color}) => (
	<div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 24, letterSpacing: '0.22em', textTransform: 'uppercase', color, marginBottom: 34}}>
		{children}
	</div>
);

// Soft watercolor-like stains, echoing the presentation's backgrounds
export const Wash: React.FC<{tone: Tone}> = ({tone}) => {
	if (tone === 'dark' || tone === 'terra') return null;
	return (
		<AbsoluteFill
			style={{
				background: [
					'radial-gradient(ellipse 60% 45% at 8% 92%, rgba(196,122,85,.22), transparent 70%)',
					'radial-gradient(ellipse 50% 40% at 95% 6%, rgba(214,170,130,.35), transparent 70%)',
					'radial-gradient(ellipse 35% 30% at 85% 70%, rgba(230,207,179,.5), transparent 70%)',
				].join(','),
			}}
		/>
	);
};

const Footer: React.FC<{index: number; total: number; color: string}> = ({index, total, color}) => (
	<div
		style={{
			position: 'absolute', left: PAD, right: PAD, bottom: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
			fontFamily: F.sans, fontSize: 21, letterSpacing: '0.12em', color, opacity: 0.85,
		}}
	>
		<span>{HANDLE}</span>
		{total > 1 && (
			<span style={{display: 'flex', alignItems: 'center', gap: 18}}>
				{index + 1} / {total}
				{index < total - 1 && <span style={{fontSize: 30}}>→</span>}
			</span>
		)}
	</div>
);

// Presentation slides carry a small watermark in the bottom-right corner; crop it out
const SlideImage: React.FC<{src: string; width: number}> = ({src, width}) => {
	const h = (width * 768) / 1376;
	return (
		<div style={{width, height: h * 0.95, overflow: 'hidden', borderRadius: 18, boxShadow: '0 40px 70px -40px rgba(80,40,20,.55)'}}>
			<Img src={staticFile(src)} style={{width: width * 1.04, height: h * 1.04, display: 'block'}} />
		</div>
	);
};

const Cover: React.FC<Extract<Slide, {kind: 'cover'}>> = ({eyebrow, title, italic, sub, photo, photoPos}) => (
	<AbsoluteFill style={{padding: `${PAD + 20}px ${PAD}px`}}>
		<Eyebrow color={C.terra}>{eyebrow ?? TITLE}</Eyebrow>
		<div style={{fontFamily: F.serif, fontWeight: 500, fontSize: photo ? 84 : 112, lineHeight: 1.08, color: C.ink, letterSpacing: '-0.01em'}}>
			{title}
			{italic && (
				<>
					{' '}
					<span style={{fontStyle: 'italic', color: C.terra}}>{italic}</span>
				</>
			)}
		</div>
		{sub && <div style={{marginTop: 30, fontFamily: F.sans, fontSize: 30, lineHeight: 1.5, color: C.ink2}}>{sub}</div>}
		{photo && (
			<Img
				src={staticFile(photo)}
				style={{position: 'absolute', left: PAD, right: PAD, bottom: 120, width: 1080 - PAD * 2, height: 650, objectFit: 'cover', objectPosition: photoPos ?? 'center', borderRadius: '444px 444px 18px 18px', boxShadow: '0 40px 80px -40px rgba(80,40,20,.55)'}}
			/>
		)}
	</AbsoluteFill>
);

const Statement: React.FC<Extract<Slide, {kind: 'statement'}>> = ({eyebrow, title, body, tone = 'cream', size = 76}) => {
	const t = toneColors[tone];
	return (
		<AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
			{eyebrow && <Eyebrow color={t.accent}>{eyebrow}</Eyebrow>}
			<div style={{fontFamily: F.serif, fontWeight: 500, fontSize: size, lineHeight: 1.2, color: t.fg}}>{title}</div>
			{body && (
				<div style={{marginTop: 48, borderLeft: `3px solid ${t.accent}`, paddingLeft: 36}}>
					{body.map((b) => (
						<div key={b} style={{fontFamily: F.serif, fontSize: 42, lineHeight: 1.5, color: t.fg2}}>
							{b}
						</div>
					))}
				</div>
			)}
		</AbsoluteFill>
	);
};

const Photo: React.FC<Extract<Slide, {kind: 'photo'}>> = ({photo, photoPos, eyebrow, title, body, size = 68}) => (
	<AbsoluteFill>
		<Img src={staticFile(photo)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: photoPos ?? 'center'}} />
		<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(30,22,16,0) 35%, rgba(30,22,16,.82) 100%)'}} />
		<AbsoluteFill style={{padding: `0 ${PAD}px 150px`, justifyContent: 'flex-end'}}>
			{eyebrow && <Eyebrow color={C.sand}>{eyebrow}</Eyebrow>}
			<div style={{fontFamily: F.serif, fontWeight: 500, fontSize: size, lineHeight: 1.2, color: '#fff'}}>{title}</div>
			{body && <div style={{marginTop: 28, fontFamily: F.sans, fontSize: 32, lineHeight: 1.5, color: '#f1e6da'}}>{body}</div>}
		</AbsoluteFill>
	</AbsoluteFill>
);

const List: React.FC<Extract<Slide, {kind: 'list'}>> = ({eyebrow, title, items, tone = 'cream', chips}) => {
	const t = toneColors[tone];
	return (
		<AbsoluteFill style={{padding: `${PAD + 20}px ${PAD}px`}}>
			{eyebrow && <Eyebrow color={t.accent}>{eyebrow}</Eyebrow>}
			<div style={{fontFamily: F.serif, fontWeight: 500, fontSize: 80, lineHeight: 1.12, color: t.fg, marginBottom: 60}}>{title}</div>
			{chips ? (
				<div style={{display: 'flex', flexWrap: 'wrap', gap: 18}}>
					{items.map((i) => (
						<span key={i} style={{fontFamily: F.sans, fontSize: 36, background: tone === 'cream' ? C.paper : C.bg, color: C.ink, borderRadius: 999, padding: '20px 36px'}}>
							{i}
						</span>
					))}
				</div>
			) : (
				<div>
					{items.map((i) => (
						<div key={i} style={{display: 'flex', gap: 26, alignItems: 'flex-start', padding: '30px 0', borderBottom: `1px solid ${tone === 'dark' ? 'rgba(255,255,255,.15)' : 'rgba(46,42,38,.12)'}`}}>
							<span style={{width: 16, height: 16, borderRadius: 99, background: t.accent, marginTop: 20, flex: 'none'}} />
							<span style={{fontFamily: F.sans, fontSize: 38, lineHeight: 1.4, color: t.fg2}}>{i}</span>
						</div>
					))}
				</div>
			)}
		</AbsoluteFill>
	);
};

const Principle: React.FC<Extract<Slide, {kind: 'principle'}>> = ({n, title, body, tone = 'cream'}) => {
	const t = toneColors[tone];
	return (
		<AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
			<div style={{position: 'absolute', right: 60, top: 10, fontFamily: F.serif, fontSize: 520, lineHeight: 1, color: t.accent, opacity: tone === 'cream' ? 0.16 : 0.22}}>{n}</div>
			<Eyebrow color={t.accent}>Principio {n}</Eyebrow>
			<div style={{fontFamily: F.serif, fontWeight: 500, fontSize: 84, lineHeight: 1.1, color: t.fg, maxWidth: 860}}>{title}</div>
			<div style={{marginTop: 56, borderLeft: `3px solid ${t.accent}`, paddingLeft: 36}}>
				{body.map((b) => (
					<div key={b} style={{fontFamily: F.sans, fontSize: 36, lineHeight: 1.55, color: t.fg2}}>
						{b}
					</div>
				))}
			</div>
		</AbsoluteFill>
	);
};

const ImageSlide: React.FC<Extract<Slide, {kind: 'image'}>> = ({eyebrow, title, image, body}) => (
	<AbsoluteFill style={{padding: `${PAD + 20}px ${PAD}px`}}>
		{eyebrow && <Eyebrow color={C.terra}>{eyebrow}</Eyebrow>}
		<div style={{fontFamily: F.serif, fontWeight: 500, fontSize: 68, lineHeight: 1.12, color: C.ink, marginBottom: 56}}>{title}</div>
		<SlideImage src={image} width={1080 - PAD * 2} />
		{body && <div style={{marginTop: 48, fontFamily: F.sans, fontSize: 32, lineHeight: 1.5, color: C.ink2}}>{body}</div>}
	</AbsoluteFill>
);

const Person: React.FC<Extract<Slide, {kind: 'person'}>> = ({photo, photoPos, role, name, org, body}) => (
	<AbsoluteFill>
		<div style={{height: 660, overflow: 'hidden'}}>
			<Img src={staticFile(photo)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: photoPos ?? 'center'}} />
		</div>
		<div style={{padding: `56px ${PAD}px`}}>
			<div style={{fontFamily: F.sans, fontWeight: 600, fontSize: 22, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.terra}}>{role}</div>
			<div style={{fontFamily: F.serif, fontWeight: 500, fontSize: 76, color: C.ink, marginTop: 14, lineHeight: 1.1}}>{name}</div>
			<div style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 34, color: C.muted, marginTop: 8}}>{org}</div>
			<div style={{fontFamily: F.sans, fontSize: 30, lineHeight: 1.45, color: C.ink2, marginTop: 22}}>{body}</div>
		</div>
	</AbsoluteFill>
);

const Price: React.FC = () => (
	<AbsoluteFill style={{padding: `${PAD + 20}px ${PAD}px`}}>
		<Eyebrow color={C.terra}>Inversión</Eyebrow>
		<div style={{fontFamily: F.serif, fontWeight: 500, fontSize: 72, lineHeight: 1.12, color: C.ink}}>Reserva tu plaza</div>
		<div style={{fontFamily: F.sans, fontSize: 30, color: C.ink2, marginTop: 18}}>Alojamiento y pensión completa incluidos.</div>
		<div style={{marginTop: 60, background: '#fff', border: `3px solid ${C.terra}`, borderRadius: 28, padding: '50px 56px', position: 'relative'}}>
			<div style={{position: 'absolute', top: -24, left: 56, background: C.terra, color: '#fff', fontFamily: F.sans, fontWeight: 600, fontSize: 20, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '10px 22px', borderRadius: 99}}>
				Pago anticipado
			</div>
			<div style={{fontFamily: F.serif, fontSize: 120, lineHeight: 1, color: C.ink}}>
				USD 1.200
			</div>
			<div style={{fontFamily: F.sans, fontSize: 30, color: C.terra, marginTop: 14, fontWeight: 500}}>Ahorras USD 150</div>
		</div>
		<div style={{marginTop: 30, border: '1px solid rgba(46,42,38,.18)', borderRadius: 28, padding: '36px 56px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
			<span style={{fontFamily: F.sans, fontSize: 28, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.ink2}}>Valor general</span>
			<span style={{fontFamily: F.serif, fontSize: 64, color: C.ink}}>USD 1.350</span>
		</div>
		<div style={{marginTop: 44, fontFamily: F.serif, fontStyle: 'italic', fontSize: 38, color: C.terra}}>Plazas limitadas.</div>
	</AbsoluteFill>
);

const Cta: React.FC<{title?: string}> = ({title}) => (
	<AbsoluteFill style={{padding: PAD, justifyContent: 'center'}}>
		<Eyebrow color={C.sand}>Formación profesional intensiva · Residencial</Eyebrow>
		<div style={{fontFamily: F.serif, fontWeight: 500, fontSize: 86, lineHeight: 1.1, color: C.bg}}>{title ?? TITLE}</div>
		<div style={{marginTop: 50, fontFamily: F.sans, fontSize: 34, lineHeight: 1.7, color: '#d8ccbf'}}>
			{DATES}
			<br />
			{PLACE}
			<br />
			Con Jimena Marchisio y Maika Castillo
		</div>
		<div style={{marginTop: 64, alignSelf: 'flex-start', background: C.terra, color: '#fff', fontFamily: F.sans, fontWeight: 500, fontSize: 32, padding: '26px 46px', borderRadius: 999}}>
			Info y reservas: link en la bio
		</div>
	</AbsoluteFill>
);

export const Post: React.FC<PostProps> = ({slide, index, total}) => {
	const tone: Tone = slide.kind === 'cta' ? 'dark' : ('tone' in slide && slide.tone) || 'cream';
	const t = toneColors[tone];
	const onPhoto = slide.kind === 'photo';
	return (
		<AbsoluteFill style={{background: t.bg}}>
			<Wash tone={tone} />
			{slide.kind === 'cover' && <Cover {...slide} />}
			{slide.kind === 'statement' && <Statement {...slide} />}
			{slide.kind === 'photo' && <Photo {...slide} />}
			{slide.kind === 'list' && <List {...slide} />}
			{slide.kind === 'principle' && <Principle {...slide} />}
			{slide.kind === 'image' && <ImageSlide {...slide} />}
			{slide.kind === 'person' && <Person {...slide} />}
			{slide.kind === 'price' && <Price />}
			{slide.kind === 'cta' && <Cta title={slide.title} />}
			<Footer index={index} total={total} color={onPhoto ? '#fff' : t.fg2} />
		</AbsoluteFill>
	);
};
