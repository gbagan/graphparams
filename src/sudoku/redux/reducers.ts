import { getType, ActionType, } from 'typesafe-actions';
import * as iter from '../../libs/iter';
import * as actions from './actions';

import { PosAndVal, ModelCell, Boards, Examples, Solution } from '../types.d';
import Solver from '../solver';

export type Action = ActionType<typeof actions>;

const boards: Boards = [
    { name: '2x2', data: 2 },
    { name: '3x3', data: 3 },
    { name: '4x4', data: 4 },
    { name: '5x5', data: 5 },
]

const examples: Examples = [{
    name: 'example 1',
    data: {
        size: 3,
        fixedCells: [[0, 0, 8], [1, 2, 3], [1, 3, 6], [2, 1, 7], [2, 4, 9], [2, 6, 2], [3, 1, 5],
        [3, 5, 7], [4, 4, 4], [4, 5, 5], [4, 6, 7], [5, 3, 1], [5, 7, 3], [6, 2, 1],
        [6, 7, 6], [6, 8, 8], [7, 2, 8], [7, 3, 5], [7, 7, 1], [8, 1, 9], [8, 6, 4]]
    }
}];

export type State = {
    readonly boards: Boards;
    readonly examples: Examples;
    readonly squaresize: number,
    readonly cells: ReadonlyArray<ModelCell> | null,
    readonly solutions: ReadonlyArray<Solution> | null,
}

const initialState: State = {
    boards: boards,
    examples: examples,
    squaresize: 0,
    cells: null,
    solutions: null
}

export default function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case getType(actions.selectGrid): {
            const squaresize = action.payload;
            const cells = computeGrid(squaresize);
            return { ...state, squaresize, cells, solutions: null }
        }
        case getType(actions.selectExample): {
            const { size, fixedCells } = action.payload;
            const cells = computeGrid(size, fixedCells.map(t => ({ row: t[0], col: t[1], value: t[2] })));
            return { ...state, squaresize: size, cells, solutions: null }
        }
        case getType(actions.fillCell): {
            const { squaresize, cells } = state;
            const { row, col, value } = action.payload;
            const size = squaresize * squaresize;
            if (cells === null)
                return state;
            const cells2 = Array.from(cells);
            cells2[row * size + col] = { value, fixed: value > 0 };
            return { ...state, cells: cells2 }
        }
        case getType(actions.solve): {
            const { cells, squaresize } = state;
            const size = squaresize * squaresize;
            if (cells === null)
                return state;
            const fixedCells = cells.map((cell, key) => ({ row: Math.floor(key / size), col: key % size, value: cell.value }))
                .filter((cell) => cell.value > 0 && cells[cell.row * size + cell.col].fixed);
            const solver = new Solver(squaresize, fixedCells);
            const solutions = Array.from(solver.solve(100));
            if (solutions.length > 0) {
                const cells2 = addSolution(cells, squaresize, solutions[0]);
                return { ...state, cells: cells2, solutions }
            } else {
                return { ...state, solutions }
            }
        }
        case getType(actions.showSolution): {
            const { cells, squaresize } = state;
            if (!cells)
                return state;
            const solution = action.payload;
            const cells2 = addSolution(cells, squaresize, solution);
            return { ...state, cells: cells2 }
        }
        default:
            return state;
    }
}

function computeGrid(val: number, fixedCells?: ReadonlyArray<PosAndVal>) {
    const size = val * val;
    const cells: ModelCell[] = Array.from(iter.map(iter.range(size * size), () => ({ fixed: false, value: 0 })));
    if (fixedCells !== undefined && fixedCells !== null) {
        for (const { row, col, value } of fixedCells) {
            cells[row * size + col] = { value, fixed: true }
        }
    }
    return cells;
}

function addSolution(cells: ReadonlyArray<ModelCell>, squaresize: number, solution: Solution | null): ReadonlyArray<ModelCell> {
    const size = squaresize * squaresize;
    let cellsCopy;
    if (solution === null) {
        cellsCopy = cells.map(cell => cell.fixed ? cell : { fixed: false, value: 0 })
    } else {
        cellsCopy = Array.from(cells)
        for (const { row, col, value } of solution) {
            const { fixed } = cells[row * size + col];
            cellsCopy[row * size + col] = { fixed, value }
        }
    }
    return cellsCopy;
}