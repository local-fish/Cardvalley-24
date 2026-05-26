export type Question = {
	cards: number[];
	blacklist?: string;
  afterMessageHeading?: string;
  afterMessage?: string;
};
export const tutorial: Question[] = [
  { cards: [9, 9, 6], blacklist: '−×÷', }
];
