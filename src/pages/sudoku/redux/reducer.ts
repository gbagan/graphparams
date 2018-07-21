import {update, times} from "ramda";
import { ActionType, getType } from "typesafe-actions";
import actions from "./actions";

import solve from "@/lib/sudoku/solver";
import { ModelCell, PosAndVal, Solution } from "../types";

export type Action = ActionType<typeof actions>;

export type State = {
    squaresize: number,
    cells: ModelCell[] | null,
    solutions: Solution[] | null,
};

const initialState: State = {
    cells: createGrid(3),
    solutions: null,
    squaresize: 3,
};

export default function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case getType(actions.selectGrid): {
            const squaresize = action.payload;
            const cells = createGrid(squaresize);
            return { ...state, squaresize, cells, solutions: null };
        }
        case getType(actions.selectExample): {
            const { size, fixedCells } = action.payload;
            const cells = createGrid(size, fixedCells.map(t => ({ row: t[0], col: t[1], value: t[2] })));
            return { ...state, squaresize: size, cells, solutions: null };
        }
        case getType(actions.fillCell): {
            const { squaresize, cells } = state;
            const { row, col, value } = action.payload;
            const size = squaresize * squaresize;
            if (cells === null)
                return state;
            const cells2 = update(row * size + col,  { value, fixed: value > 0 }, cells);
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

function createGrid(val: number, fixedCells?: PosAndVal[]): ModelCell[] {
    const size = val * val;
    const cells = times(_ => ({ fixed: false, value: 0 }), size * size);
    const fcells = fixedCells || [];

    return fcells.reduce((cs, {row, col, value}) =>
                        update(row * size + col, { value, fixed: true }, cs),
                        cells
                    );
}

function addSolution(cells: ModelCell[], squaresize: number,
                     solution: Solution | null): ModelCell[] {
    const size = squaresize * squaresize;
    return solution === null
        ? cells.map(cell => cell.fixed ? cell : { fixed: false, value: 0 })
        : solution.reduce((cs, {row, col, value}) =>
            update(row * size + col, { value, fixed: false }, cs),
            cells,
        );
}
