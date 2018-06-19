import { createAction, createStandardAction } from "typesafe-actions";

import {Rules} from "../types";

const actions = {
    moveQueen: createStandardAction("queens/MOVE-QUEEN")<{id: number, row: number, col: number}>(),
    reset: createAction("queens/RESET"),
    newGrid: createStandardAction("queens/NEW-GRID")<{rows: number; columns: number, rules: Rules}>(),
};

export default actions;
