import { ActionType, getType } from "typesafe-actions";

import {sum} from "../../lib/iter";
import solve from "../../lib/lightsout/solver";
import {Solution} from "../types";
import * as actions from "./actions";

export type Action = ActionType<typeof actions>;

type State = {
    rows: number;
    columns: number;
    nbColors: number;
    toroidal: boolean;
    board: ReadonlyArray<number> | null;
    solutions: ReadonlyArray<Solution> | null;
    currentSolution: Solution | null;
};

const initialState: State = {
    board: null,
    columns: 0,
    currentSolution: null,
    nbColors: 0,
    rows: 0,
    solutions: null,
    toroidal: false,
};

export default function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case getType(actions.generate): {
            const { rows, columns, nbColors, toroidal} = action.payload;
            const board = new Array<number>(rows * columns);
            board.fill(0);
            return { ...state, rows, columns, nbColors, toroidal, board, solutions: null, currentSolution: null };
        }
        case getType(actions.switchCell): {
            if (!state.board) {
                return state;
            }
            const i = action.payload.row * state.columns + action.payload.column;
            const board = state.board.map((val, j) => i === j ? (val + 1) % state.nbColors : val);
            return { ...state, board, solutions: null, currentSolution: null };
        }
        case getType(actions.solve): {
            if (!state.board) {
                return state;
            }
            const solutions = [...solve(state.board, state.rows, state.columns, state.nbColors, state.toroidal, 250)];
            solutions.sort((a, b) => sum(a) - sum(b));
            const currentSolution = solutions.length === 0 ? null : solutions[0];
            return {...state, solutions, currentSolution};
        }
        case getType(actions.reverse): {
            if (!state.board) {
                return state;
            }
            const board = state.board.map(val => (val + 1) % state.nbColors);
            return { ...state, board, solutions: null, currentSolution: null };
        }
        case getType(actions.showSolution): {
            return { ...state, currentSolution: action.payload };
        }
        default:
            return state;
    }
}
