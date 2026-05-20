export interface UserData {
  name: string;
  age: string;
  gender: string;
  org: string;
}
export interface LevelResult {
	level: number;
	//moves: Move[];
	time: number;
	correct: boolean;
  notes?: string;
}
export interface Move {
	cardA: number;
	cardB: number;
	op: string;
	result: number;
}

let _userData: UserData | null = null;

export function setUserData(data: UserData) {
  _userData = data;
}

export function getUserData(): UserData | null {
  return _userData;
}
