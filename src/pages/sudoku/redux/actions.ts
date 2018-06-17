import { createAction, createStandardAction } from "typesafe-actions";
import { Example, PosAndVal, Solution } from "../types";

const actions = {
    fillCell: createStandardAction("eds/FILL-CELL")<PosAndVal>(),
    selectExample: createStandardAction("eds/SELECT-EXAMPLE")<Example>(),
    selectGrid: createStandardAction("eds/SELECT-GRID")<number>(),
    showSolution: createStandardAction("eds/SHOW-SOLUTION")<Solution | null>(),
    solve: createAction("sudoku/SOLVE"),
};

export default actions;
