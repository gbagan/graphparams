import { createAction, createStandardAction } from "typesafe-actions";
import { Example, PosAndVal, Solution } from "../types";

export const solve = createAction("sudoku/SOLVE");
export const selectGrid = createStandardAction("eds/SELECT-GRID")<number>();
export const selectExample = createStandardAction("eds/SELECT-EXAMPLE")<Example>();
export const fillCell = createStandardAction("eds/FILL-CELL")<PosAndVal>();
export const showSolution = createStandardAction("eds/SHOW-SOLUTION")<Solution | null>();
