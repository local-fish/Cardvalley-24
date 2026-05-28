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
  localStorage.setItem('userData', JSON.stringify(data));
}

export function getUserData(): UserData | null {
  if (_userData) return _userData;
  const stored = localStorage.getItem('userData');
  return stored ? JSON.parse(stored) : null;
}
