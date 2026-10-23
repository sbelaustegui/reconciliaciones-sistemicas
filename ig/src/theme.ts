import {loadFont as loadSerif} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as loadSans} from '@remotion/google-fonts/Montserrat';

const serif = loadSerif('normal', {weights: ['400', '500', '600'], subsets: ['latin']});
loadSerif('italic', {weights: ['400', '500'], subsets: ['latin']});
const sans = loadSans('normal', {weights: ['300', '400', '500', '600'], subsets: ['latin']});

export const F = {serif: serif.fontFamily, sans: sans.fontFamily};

export const C = {
	bg: '#f7f1e8',
	bg2: '#efe4d4',
	paper: '#fbf8f3',
	ink: '#2e2a26',
	ink2: '#5b524a',
	muted: '#8a7d70',
	terra: '#a8553a',
	terra2: '#c47a55',
	sand: '#e6cfb3',
	sage: '#9fb39a',
};

export type Tone = 'cream' | 'sand' | 'dark' | 'terra';

export const toneColors: Record<Tone, {bg: string; fg: string; fg2: string; accent: string}> = {
	cream: {bg: C.bg, fg: C.ink, fg2: C.ink2, accent: C.terra},
	sand: {bg: C.bg2, fg: C.ink, fg2: C.ink2, accent: C.terra},
	dark: {bg: C.ink, fg: C.bg, fg2: '#d8ccbf', accent: C.sand},
	terra: {bg: C.terra, fg: '#fff', fg2: '#f8e6da', accent: C.sand},
};

export const HANDLE = '@mindcompass.pty';
export const TITLE = 'Reconciliaciones Sistémicas con Caballos';
export const DATES = '16 al 21 de febrero de 2027';
export const PLACE = 'Vedia · Buenos Aires · Argentina';
