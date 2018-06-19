import * as R from "ramda"; 
import {ActionType, getType } from "typesafe-actions";
import actions from "./actions";
import {Board, Peg, Position} from "../types";
import {english} from "../boards";

export type Action = ActionType<typeof actions>;
type History<T> = {head: T, tail: History<T>} | null;

export type State = Board & {
    history: History<{middleId: number, p1: Position, p2: Position}>;
};

const initialState: State = {
    ...english,
    history: null,
};

function movePeg(initId: number, row2: number, col2: number, pegs: Peg[]) {
    const initPeg = R.find(R.propEq("id", initId), pegs)!;
    const row1 = initPeg.row;
    const col1 = initPeg.col;
    const middle = {row: (row1 + row2) / 2, col: (col1 + col2) / 2};
    const middlePeg = R.find(p => R.equals(R.pick(["row", "col"], p), middle), pegs)!;
    const newPegs =  R.without([middlePeg],
                        R.map(p => R.equals(p, initPeg) ? {id: p.id, row: row2, col: col2} : p, pegs)
                    );
    return {
        pegs: newPegs,
        middleId: middlePeg.id,
        row1,
        col1,
    }
}


function undo(middleId: number, begin: Position, end: Position, pegs: Peg[]) {
    const ppegs: Position[] = R.project(["row", "col"], pegs);
    const middlePeg = {id: middleId, row: (begin.row + end.row) / 2, col: (begin.col + end.col) / 2};
    const endIndex = R.findIndex(R.equals(end), ppegs);
    return R.append(middlePeg,
                    R.adjust(R.flip(R.merge)(begin), endIndex, pegs)
                );
}

export default function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case getType(actions.movePeg): {
            const {id, row, col} = action.payload;
            const {pegs, middleId, row1, col1} = movePeg(id, row, col, state.pegs);
            return {...state,
                    pegs,
                    history: ({head: {middleId, p1: {row: row1, col: col1}, p2: {row, col}},
                               tail: state.history}),
                };
        }
        case getType(actions.undo): {
            if (state.history === null)
                return state;
            else {
                const {head, tail} = state.history;
                const {middleId, p1, p2} = head;
                return { ...state,
                         pegs: undo(middleId, p1, p2, state.pegs),
                         history: tail,
                      }
            }
        }
        case getType(actions.load): {
            return {...action.payload, history: null}
        }
        default:
            return state;
    }
}
