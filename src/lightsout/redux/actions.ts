import { createAction, createStandardAction } from "typesafe-actions";
import { FormData, Position, Solution } from "../types";

export const generate = createStandardAction("lightsout/GENERATE")<FormData>();
export const switchCell = createStandardAction("lightsout/SWITCH_CELL")<Position>();
export const solve = createAction("lightsout/SOLVE");
export const reverse = createAction("lightsout/REVERSE");
export const showSolution = createStandardAction("lightsout/SHOW_SOLUTION")<Solution | null>();
