import { createAction, createStandardAction } from "typesafe-actions";

import {LegalMoves, PieceType} from "../types";

const actions = {
    putPiece: createStandardAction("queens/PUT-PIECE")<{row: number, col: number, type: PieceType}>(),
    reset: createAction("queens/RESET"),
    newGrid: createStandardAction("queens/NEW-GRID")<{rows: number;
                                                      columns: number,
                                                      availablePieces: PieceType[]
                                                      customLegalMoves: LegalMoves,
                                                    }>(),
};

export default actions;
