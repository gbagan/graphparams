import * as R from "ramda";
import {Position} from "./types";

export const areNeighbors = (q1: Position, q2: Position) =>
    q1.row !== -1 && q2.row !== -1 &&
                      (q1.row === q2.row
                    || q1.col === q2.col
                    || Math.abs(q1.row - q2.row) === Math.abs(q1.col - q2.col));

const path = (q1: Position) => (q2: Position) => {
    if (!R.equals(q1, q2) && areNeighbors(q1, q2)) {
        const dRow = q1.row === q2.row ? 0 : q1.row < q2.row ? 1 : -1;
        const dCol = q1.col === q2.col ? 0 : q1.col < q2.col ? 1 : -1;
        return R.times(i => ({row: q1.row + dRow * i, col: q1.col + dCol * i}),
            Math.max(Math.abs(q1.row - q2.row), Math.abs(q1.col - q2.col)) + 1
        );
    } else {
        return [];
    }
};

export const squaresBetweenConflicts = (q1: Position, qs: Position[]) =>
    R.uniq(R.chain(path(q1), qs));