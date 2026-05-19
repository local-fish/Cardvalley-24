export interface LevelResult {
	level: number;
	//moves: Move[];
	timeMs: number;
	correct: boolean;
}
export interface Move {
	cardA: number;
	cardB: number;
	op: string;
	result: number;
}
