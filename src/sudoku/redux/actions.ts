import { createAction } from 'typesafe-actions';
import { PosAndVal, Example, Solution } from '../types';

export const solve = createAction('sudoku/SOLVE', resolve => () => resolve());
export const selectGrid = createAction('eds/SELECT-GRID', resolve => (n: number) => resolve(n));
export const selectExample = createAction('eds/SELECT-EXAMPLE', resolve => (e: Example) => resolve(e));
export const fillCell = createAction('eds/FILL-CELL', resolve => (cell: PosAndVal) => resolve(cell));
export const showSolution = createAction('eds/SHOW-SOLUTION', resolve => (s: Solution) => resolve(s));