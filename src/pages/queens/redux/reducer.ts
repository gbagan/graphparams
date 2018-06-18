import * as R from "ramda";
import { ActionType, getType } from "typesafe-actions";
import actions from "./actions";
import {Position} from "../types";

export type Action = ActionType<typeof actions>;

export type State = {
    queens: Position [];
};

const initQueens = R.times(i => ({ row: -1, col: i }));

const initialState: State = {
    queens: initQueens(8),
};

export default function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case getType(actions.selectGrid): {
            const size = action.payload;
            return { queens: initQueens(size) };
        }
        case getType(actions.moveQueen): {
            const { id, row, col } = action.payload;
            return { queens: R.update(id, {row, col}, state.queens) };
        }
        case getType(actions.reset): {
            return { queens: initQueens(state.queens.length)};
        }

        default:
            return state;
    }
}
