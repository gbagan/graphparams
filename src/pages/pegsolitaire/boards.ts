import * as R from "ramda";
import {Position} from "./types";

const square = (rows: number, columns: number) =>
    R.times(i => ({
        col: i % columns,
        row: Math.floor(i / columns),
    }), rows * columns);

const generateBoard = (rows: number, columns: number,
                       holeFilter: (p: Position) => boolean,
                       nonPegHoles: Position[]) => {
    const holes = R.filter(holeFilter, square(rows, columns));
    const pegs = R.without(nonPegHoles, holes).map((p, i) => ({...p, id: i}));
    return {rows, columns, holes, pegs};
}

export const english = generateBoard(7, 7,
                        ({row, col}) => Math.min(row, 6 - row) >= 2 || Math.min(col, 6 - col) >= 2,
                        [{row: 3, col: 3}]
);

export const french = generateBoard(7, 7,
    ({row, col}) => Math.min(row, 6 - row) +  Math.min(col, 6 - col) >= 2,
    [{row: 3, col: 3}]
);

export const diamond = generateBoard(9, 9,
    ({row, col}) => Math.min(row, 8 - row) + Math.min(col, 8 - col) >= 4,
    [{row: 4, col: 4}]
);

export const wiegleb = generateBoard(9, 9,
    ({row, col}) => Math.min(row, 8 - row) >= 3 || Math.min(col, 8 - col) >= 3,
    [{row: 4, col: 4}]
);

export const asymetric = generateBoard(8, 8,
    ({row, col}) => Math.min(row, 8 - row) >= 3 || Math.min(col, 8 - col) >= 3,
    [{row: 4, col: 4}]
);
