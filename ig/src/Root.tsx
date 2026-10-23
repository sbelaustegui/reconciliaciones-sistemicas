import React from 'react';
import {Composition, Still} from 'remotion';
import {carousels, posts} from './content';
import {Post} from './Post';
import {FPS, Reel, reels, totalFrames} from './Reels';

const pad = (n: number) => String(n).padStart(2, '0');

// Composition ids encode the output path: car-<carousel>-<NN>, post-<name>, reel-<name>
export const Root: React.FC = () => (
	<>
		{Object.entries(carousels).flatMap(([name, slides]) =>
			slides.map((slide, i) => (
				<Still key={`${name}-${i}`} id={`car-${name}-${pad(i + 1)}`} component={Post} width={1080} height={1350} defaultProps={{slide, index: i, total: slides.length}} />
			)),
		)}
		{Object.entries(posts).map(([name, slide]) => (
			<Still key={name} id={`post-${name}`} component={Post} width={1080} height={1350} defaultProps={{slide, index: 0, total: 1}} />
		))}
		{Object.keys(reels).map((name) => (
			<Composition key={name} id={`reel-${name}`} component={Reel} width={1080} height={1920} fps={FPS} durationInFrames={totalFrames(reels[name])} defaultProps={{name}} />
		))}
	</>
);
