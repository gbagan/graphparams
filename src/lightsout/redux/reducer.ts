import { ActionType, getType } from "typesafe-actions";
import * as R from "ramda";

import solve from "../../lib/lightsout/solver";
import {Solution} from "../types";
import * as actions from "./actions";

export type Action = ActionType<typeof actions>;

type State = {
    rows: number;
    columns: number;
    nbColors: number;
    toroidal: boolean;
    board: number[] | null;
    solutions: Solution[] | null;
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
            const board = R.times(_ => 0, rows * columns);
            return { ...state, rows, columns, nbColors, toroidal, board, solutions: null, currentSolution: null };
        }
        case getType(actions.switchCell): {
            if (!state.board)
                return state;
            const i = action.payload.row * state.columns + action.payload.column;
            const board = state.board.map((val, j) => i === j ? (val + 1) % state.nbColors : val);
            return { ...state, board, solutions: null, currentSolution: null };
        }
        case getType(actions.solve): {
            if (!state.board)
                return state;
            const solutions = R.sortBy(R.sum,
                [...solve(state.board, state.rows, state.columns, state.nbColors, state.toroidal, 250)]
            );
            const currentSolution = solutions.length === 0 ? null : solutions[0];
            return {...state, solutions, currentSolution};
        }
        case getType(actions.reverse): {
            if (!state.board)
                return state;
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
