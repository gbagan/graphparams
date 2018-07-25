import {map, reduce, update, times} from '@fp';
import {handleActions} from '@/commonreact';
import actions from './actions';
import solve from '@/lib/sudoku/solver';

const createGrid = (val, fixedCells) => {
    const size = val * val;
    const cells = times(_ => ({ fixed: false, value: 0 }), size * size);

    return reduce(
                (cs, {row, col, value}) => update(row * size + col, {value, fixed: true}, cs),
                cells,
                fixedCells || []
            );
};

function addSolution(cells, squaresize, solutionOrNull) {
    const size = squaresize * squaresize;
    return solutionOrNull === null
        ? map(cell => cell.fixed ? cell : { fixed: false, value: 0 }, cells)
        : reduce(
            (cs, {row, col, value}) => update(row * size + col, { value, fixed: false }, cs),
            cells,
            solutionOrNull
        );
}


const initialState = {
    cells: createGrid(3),
    solutions: null,
    squaresize: 3,
    selectedCell: null,
};

const reducer = handleActions({
    [actions.selectGrid]: (state, squaresize) => {
        const cells = createGrid(squaresize);
        return { ...state, squaresize, cells, solutions: null };
    },
    [actions.selectExample]: (state, {size, fixedCells}) => {
        const cells = createGrid(size, fixedCells.map(t => ({ row: t[0], col: t[1], value: t[2] })));
        return { ...state, squaresize: size, cells, solutions: null };
    },
    [actions.fillCell]: (state, value) => {
        const { squaresize, cells, selectedCell } = state;
        if(!selectedCell || !cells)
            return state;
        const {row, col} = selectedCell;
        const size = squaresize * squaresize;
        const cells2 = update(row * size + col, {value, fixed: value > 0}, cells);
        return {...state, cells: cells2, selectedCell: null};
    },
    [actions.selectCell]: (state, cell) => ({...state, selectedCell: cell}),
    [actions.solve]: state => {
        const {cells, squaresize} = state;
        const size = squaresize * squaresize;
        if (cells === null)
            return state;
        const fixedCells = cells
            .map((cell, key) => ({
                col: key % size, row: Math.floor(key / size),  value: cell.value,
            })).filter(cell =>
                cell.value > 0 && cells[cell.row * size + cell.col].fixed
            );
        const solutions = [...solve(squaresize, fixedCells, 100)];
        if (solutions.length > 0) {
            const cells2 = addSolution(cells, squaresize, solutions[0]);
            return { ...state, cells: cells2, solutions };
        } else {
            return { ...state, solutions };
        }
    },
    [actions.showSolution]: (state, solution) => {
        const { cells, squaresize } = state;
        if (!cells) 
            return state;
        const cells2 = addSolution(cells, squaresize, solution);
        return { ...state, cells: cells2 };
    }
}, initialState);

export default reducer;