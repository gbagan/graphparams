import { createAction, createStandardAction } from "typesafe-actions";
import {Board} from "../types";

const actions = {
    movePeg: createStandardAction("pegsolitaire/MOVE-PEG")<{id: number, row: number, col: number}>(),
    undo: createAction("pegsolitaire/UNDO"),
    load: createStandardAction("pegsolitaire/LOAD")<Board>(),
};

export default actions;
