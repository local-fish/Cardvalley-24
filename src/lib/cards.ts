export type Card = {
	id: number;
	value: number;
	image: string;
	highlight: string;
};

export type PlayingCard = {
	id: number;
	value: number;
	image: string;
	highlight: string;
	handId: number;
	displayValue: number;
	isResult: boolean;
	stackCount: number;
};
export const cards = [
	{ id: 1, value: 1, image: '/cards/1.webp', highlight: '/cards/1-alt.webp' },
	{ id: 2, value: 2, image: '/cards/2.webp', highlight: '/cards/2-alt.webp' },
	{ id: 3, value: 3, image: '/cards/3.webp', highlight: '/cards/3-alt.webp' },
	{ id: 4, value: 4, image: '/cards/4.webp', highlight: '/cards/4-alt.webp' },
	{ id: 5, value: 5, image: '/cards/5.webp', highlight: '/cards/5-alt.webp' },
	{ id: 6, value: 6, image: '/cards/6.webp', highlight: '/cards/6-alt.webp' },
	{ id: 7, value: 7, image: '/cards/7.webp', highlight: '/cards/7-alt.webp' },
	{ id: 8, value: 8, image: '/cards/8.webp', highlight: '/cards/8-alt.webp' },
	{ id: 9, value: 9, image: '/cards/9.webp', highlight: '/cards/9-alt.webp' },

	{ id: 10, value: 1.5, image: '/cards/10.webp', highlight: '/cards/10-alt.webp' },
	{ id: 11, value: 2.5, image: '/cards/11.webp', highlight: '/cards/11-alt.webp' },
	{ id: 12, value: 3.5, image: '/cards/12.webp', highlight: '/cards/12-alt.webp' },
	{ id: 13, value: 4.5, image: '/cards/13.webp', highlight: '/cards/13-alt.webp' },
	{ id: 14, value: 5.5, image: '/cards/14.webp', highlight: '/cards/14-alt.webp' },
	{ id: 15, value: 6.5, image: '/cards/15.webp', highlight: '/cards/15-alt.webp' },
	{ id: 16, value: 7.5, image: '/cards/16.webp', highlight: '/cards/16-alt.webp' },
];
