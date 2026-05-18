export type Operator = {
  symbol: string,
  fn: (a: number, b: number) => number;
}
export const operators: Operator[] = [
  { symbol: '+', fn: (a: number, b: number) => a + b },
  { symbol: '−', fn: (a: number, b: number) => a - b },
  { symbol: '×', fn: (a: number, b: number) => a * b },
  { symbol: '÷', fn: (a: number, b: number) => a / b },
];
