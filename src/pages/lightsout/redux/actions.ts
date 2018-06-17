import { createAction, createStandardAction } from "typesafe-actions";
import { FormData, Position, Solution } from "../types";

const actions = {
    generate: createStandardAction("lightsout/GENERATE")<FormData>(),
    reverse: createAction("lightsout/REVERSE"),
    showSolution: createStandardAction("lightsout/SHOW_SOLUTION")<Solution | null>(),
    solve: createAction("lightsout/SOLVE"),
    switchCell: createStandardAction("lightsout/SWITCH_CELL")<Position>(),
};

export default actions;
