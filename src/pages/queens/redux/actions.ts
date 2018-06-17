import { createAction, createStandardAction } from "typesafe-actions";

const actions = {
    moveQueen: createStandardAction("queens/MOVE-QUEEN")<{id: number, row: number, col: number}>(),
    reset: createAction("queens/RESET"),
    selectGrid: createStandardAction("queens/SELECT-GRID")<number>(),
};

export default actions;
