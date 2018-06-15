
import dlx from "./dlx";
import {PosAndVal, Solution} from "./types";

const square = (squaresize: number) => (i: number, j: number) => 
    i - i % squaresize + Math.floor(j / squaresize);

const cellToNumber = (squaresize: number) => (cell: PosAndVal) => {
    const size = squaresize * squaresize;
    const size2 = size * size;
    return cell.row * size2 + cell.col * size + cell.value - 1;
}

const numberToCell = (squaresize: number) => (n: number) => {
    const size = squaresize * squaresize;
    const size2 = size * size;
    return {
        col: Math.floor(n / size)  % size,
        row: Math.floor(n / size2),
        value: n % size + 1,
    };
}

function generateMatrix(squaresize: number) {
    const size = squaresize * squaresize;
    const size2 = size * size;
    const matrix: [number, number][] = [];
    let v = 0;
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            for (let k = 0; k < size; k++) {
                matrix.push([v, i * size + j]);
                matrix.push([v, size2 + i * size + k]);
                matrix.push([v, 2 * size2 + j * size + k]);
                matrix.push([v, 3 * size2 + square(squaresize)(i, j) * size + k]);
                v++;
            }
        }
    }
    return matrix;
}

export default function * solve(squaresize: number, fixedCells: PosAndVal[], limit?: number): Iterable<Solution> {
    const size = squaresize * squaresize;
    const size2 = size * size;
    const size3 = size * size * size;
    const matrix = generateMatrix(squaresize);

    const fixedCells2 = fixedCells.map(cellToNumber(squaresize));
    let i = 0;
    for (const sol of dlx(size3, 4 * size2, matrix, fixedCells2)) {
        yield sol.map(numberToCell(squaresize));
        i++;
        if (limit !== undefined && i === limit) {
            return;
        }
    }
}
