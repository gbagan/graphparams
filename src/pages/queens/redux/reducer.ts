// import * as R from "ramda";
import { ActionType, getType } from "typesafe-actions";
import actions from "./actions";
import {Piece, Rules} from "../types";

export type Action = ActionType<typeof actions>;

export type State = {
    columns: number;
    rows: number;
    pieces: Piece[];
    rules: Rules;
};

// const initQueens = R.times(i => ({ row: -1, col: i }));

const initialState: State = {
    columns: 8,
    rows: 8,
    pieces: [],
    rules: {
        pieces: ["queen"]
    }
};

export default function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case getType(actions.newGrid): {
            const {rows, columns, rules} = action.payload;
            return {...state, rows, columns, rules, pieces: []};
        } /*
        case getType(actions.moveQueen): {
            const { id, row, col } = action.payload;
            return { queens: R.update(id, {row, col}, state.queens) };
        }
        case getType(actions.reset): {
            return { queens: initQueens(state.queens.length)};
        }
        */
        default:
            return state;
    }
}
