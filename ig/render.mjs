// Renders every composition: carousels and posts as PNG, reels as MP4.
// Usage: node render.mjs [filter]   e.g. node render.mjs car-2  |  node render.mjs reel
import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill, renderMedia} from '@remotion/renderer';

const filter = process.argv[2] ?? '';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comps = (await getCompositions(serveUrl)).filter((c) => c.id.includes(filter));

const outPath = (id) => {
	const [type, ...rest] = id.split('-');
	if (type === 'car') {
		const n = rest.pop();
		return `out/carruseles/${rest.join('-')}/${n}.png`;
	}
	if (type === 'post') return `out/posts/${rest.join('-')}.png`;
	return `out/reels/${rest.join('-')}.mp4`;
};

for (const composition of comps) {
	const output = path.resolve(outPath(composition.id));
	fs.mkdirSync(path.dirname(output), {recursive: true});
	if (output.endsWith('.png')) {
		await renderStill({composition, serveUrl, output, imageFormat: 'png'});
	} else {
		await renderMedia({composition, serveUrl, codec: 'h264', crf: 18, outputLocation: output});
	}
	console.log("✓", path.relative(process.cwd(), output));
}
