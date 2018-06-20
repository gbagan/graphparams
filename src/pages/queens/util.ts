import * as R from "ramda";
import {LegalMoves, Piece, PieceType, Position} from "./types";

export const piecesList = ["queen", "king", "rook", "knight", "bishop", "custom"];

export function flip<T>(x: T, l: T[]) {
    const index = R.findIndex(R.equals(x), l);
    return index === -1 ? R.append(x, l) : R.remove(index, 1, l);
}

const rookMoves = [{row: 1, col: 0}, {row: -1, col: 0}, {row: 0, col: 1}, {row: 0, col: -1}];
const bishopMoves = [{row: 1, col: 1}, {row: 1, col: -1}, {row: -1, col: 1}, {row: -1, col: -1}];
const knightMoves =  [{row: 1, col: 2}, {row: 1, col: -2}, {row: -1, col: 2}, {row: -1, col: -2},
                      {row: 2, col: 1}, {row: 2, col: -1}, {row: -2, col: 1}, {row: -2, col: -1}];
const queenMoves = rookMoves.concat(bishopMoves);

export const legalMovesFor = (p: PieceType, customMoves: LegalMoves) => {
    if (p === "queen")
        return {local: [], long: queenMoves};
    else if (p === "king")
       return {local: queenMoves, long: []};
    else if (p === "bishop")
        return {local: [], long: bishopMoves};
    else if (p === "knight")
        return {local: knightMoves, long: []};
    else
        return customMoves;
}

export const square = (rows: number, columns: number) =>
    R.times(i => ({
        col: i % columns,
        row: Math.floor(i / columns),
    }), rows * columns);

export const canCapture = (p1: Piece, p2: Position, customMoves: LegalMoves) => {
    const rules = legalMovesFor(p1.type, customMoves);
    const dRow = p2.row - p1.row;
    const dCol = p2.col - p1.col;
    const m = Math.max(Math.abs(dRow), Math.abs(dCol));
    const vector = {row: dRow, col: dCol};
    const normVector = { row: dRow / m, col: dCol / m};
    return R.contains(vector, rules.local) || R.contains(normVector, rules.long);
}

export const isCapturable = (p: Position, pieces: Piece[], customMoves: LegalMoves) =>
    R.any(p2 => canCapture(p2, p, customMoves), pieces);

export const noConflict = (pieces: Piece[], customMoves: LegalMoves) =>
    R.all(({row, col}) => !isCapturable({row, col}, pieces, customMoves), pieces);

export const reachableFrom = (piece: Piece, rows: number, columns: number, customMoves: LegalMoves) => (
    R.filter(pos => canCapture(piece, pos, customMoves), square(rows, columns))
);
