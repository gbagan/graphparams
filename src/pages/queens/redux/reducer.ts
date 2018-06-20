import * as R from "ramda";
import { ActionType, getType } from "typesafe-actions";
import actions from "./actions";
import {LegalMoves, Piece, PieceType} from "../types";
import {noConflict} from "../util";

type Action = ActionType<typeof actions>;

type Parameters = {
    columns: number;
    rows: number;
    availablePieces: PieceType[];
}

export type State = Parameters & {
    pieces: Piece[];
    customLegalMoves: LegalMoves;
    bestScores: {params: Parameters, pieces: Piece[]}[];
};

// const initQueens = R.times(i => ({ row: -1, col: i }));

const putPiece = (row: number, col: number, type: PieceType, pieces: Piece[]) => {
    const pos = {row, col};
    const index = R.findIndex(R.equals(pos), R.project(["row", "col"], pieces));
    if (index === -1)
        return R.append({row, col, type}, pieces);
    else if (pieces[index].type === type)
        return R.remove(index, 1, pieces);
    else
        return R.adjust(p => ({...p, type}), index, pieces);
}

const updateScores = (state: State) => {
    const {columns, rows, availablePieces, pieces, bestScores} = state;
    const params = {columns, rows, availablePieces};
    const index = R.findIndex(R.propEq("params", params), bestScores);
    if (index === -1)
        return R.append({params, pieces}, bestScores);
    else if (pieces.length > bestScores[index].pieces.length) {
        return R.update(index, ({params, pieces}), bestScores);
    } else {
        return bestScores;
    }
}

const initialState = (() => {
    const state: State = {
        columns: 8,
        rows: 8,
        pieces: [],
        availablePieces: ["queen"],
        bestScores: [],
        customLegalMoves: {local: [], long: []},
    };
    return  {...state, bestScores: updateScores(state)};
})();

export default function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case getType(actions.newGrid): {
            const {rows, columns, availablePieces, customLegalMoves} = action.payload;
            const state2 = {...state, rows, columns, availablePieces, customLegalMoves, pieces: []};
            return {...state2, bestScores: updateScores(state2) };
        }
        case getType(actions.putPiece): {
            const { row, col, type } = action.payload;
            const state2 = {...state, pieces: putPiece(row, col, type, state.pieces)};
            return noConflict(state2.pieces, state.customLegalMoves)
                    ? {...state2, bestScores: updateScores(state2) }
                    : state2;
        }
        default:
            return state;
    }
}
