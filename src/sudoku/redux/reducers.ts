import { ActionType, getType } from "typesafe-actions";
import * as iter from "../../lib/iter";
import * as actions from "./actions";

import solve from "../../lib/sudoku/solver";
import { Boards, Examples, ModelCell, PosAndVal, Solution } from "../types";

export type Action = ActionType<typeof actions>;

const boards: Boards = [
    { name: "2x2", data: 2 },
    { name: "3x3", data: 3 },
    { name: "4x4", data: 4 },
    { name: "5x5", data: 5 },
];

const examples: Examples = [{
    data: {
        fixedCells: [[0, 0, 8], [1, 2, 3], [1, 3, 6], [2, 1, 7], [2, 4, 9], [2, 6, 2], [3, 1, 5],
        [3, 5, 7], [4, 4, 4], [4, 5, 5], [4, 6, 7], [5, 3, 1], [5, 7, 3], [6, 2, 1],
        [6, 7, 6], [6, 8, 8], [7, 2, 8], [7, 3, 5], [7, 7, 1], [8, 1, 9], [8, 6, 4]],
        size: 3,
    },
    name: "example 1",
}];

export type State = {
    readonly boards: Boards;
    readonly examples: Examples;
    readonly squaresize: number,
    readonly cells: ReadonlyArray<ModelCell> | null,
    readonly solutions: ReadonlyArray<Solution> | null,
};

const initialState: State = {
    boards,
    cells: null,
    examples,
    solutions: null,
    squaresize: 0,
};

export default function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case getType(actions.selectGrid): {
            const squaresize = action.payload;
            const cells = computeGrid(squaresize);
            return { ...state, squaresize, cells, solutions: null };
        }
        case getType(actions.selectExample): {
            const { size, fixedCells } = action.payload;
            const cells = computeGrid(size, fixedCells.map(t => ({ row: t[0], col: t[1], value: t[2] })));
            return { ...state, squaresize: size, cells, solutions: null };
        }
        case getType(actions.fillCell): {
            const { squaresize, cells } = state;
            const { row, col, value } = action.payload;
            const size = squaresize * squaresize;
            if (cells === null) {
                return state;
            }
            const cells2 = Array.from(cells);
            cells2[row * size + col] = { value, fixed: value > 0 };
            return { ...state, cells: cells2 };
        }
        case getType(actions.solve): {
            const { cells, squaresize } = state;
            const size = squaresize * squaresize;
            if (cells === null) {
                return state;
            }
            const fixedCells = cells.map((cell, key) => ({
                col: key % size, row: Math.floor(key / size),  value: cell.value,
            })).filter(cell => cell.value > 0 && cells[cell.row * size + cell.col].fixed);
            const solutions = [...solve(squaresize, fixedCells, 100)];
            if (solutions.length > 0) {
                const cells2 = addSolution(cells, squaresize, solutions[0]);
                return { ...state, cells: cells2, solutions };
            } else {
                return { ...state, solutions };
            }
        }
        case getType(actions.showSolution): {
            const { cells, squaresize } = state;
            if (!cells) {
                return state;
            }
            const solution = action.payload;
            const cells2 = addSolution(cells, squaresize, solution);
            return { ...state, cells: cells2 };
        }
        default:
            return state;
    }
}

function computeGrid(val: number, fixedCells?: ReadonlyArray<PosAndVal>) {
    const size = val * val;
    const cells: ModelCell[] = [...iter.map(iter.range(size * size), () => ({ fixed: false, value: 0 }))];
    if (fixedCells !== undefined && fixedCells !== null) {
        for (const { row, col, value } of fixedCells) {
            cells[row * size + col] = { value, fixed: true };
        }
    }
    return cells;
}

function addSolution(cells: ReadonlyArray<ModelCell>, squaresize: number,
                     solution: Solution | null): ReadonlyArray<ModelCell> {
    const size = squaresize * squaresize;
    let cellsCopy: ModelCell[];
    if (solution === null) {
        cellsCopy = cells.map(cell => cell.fixed ? cell : { fixed: false, value: 0 });
    } else {
        cellsCopy = [...cells];
        for (const { row, col, value } of solution) {
            const { fixed } = cells[row * size + col];
            cellsCopy[row * size + col] = { fixed, value };
        }
    }
    return cellsCopy;
}
