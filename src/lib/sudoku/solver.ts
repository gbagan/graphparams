
import dlx from "./dlx";
import {PosAndVal, Solution} from "./types";

class Solver {
    private readonly dim: number;  // dimension of a square
    private readonly size: number; // dimension of the grid
    private readonly size2: number; // size * size
    private readonly size3: number; // size * size * size
    private readonly matrix: Array<[number, number]>;
    private readonly fixedCells: ReadonlyArray<PosAndVal>;

    constructor(n: number, fixedCells: ReadonlyArray<PosAndVal>) {
        this.dim = n;
        this.size = n * n;
        this.size2 = this.size * this.size;
        this.size3 = this.size2 * this.size;
        this.matrix = [];
        this.generateMatrix();
        this.fixedCells = fixedCells;
    }

    public *solve(limit?: number): Iterable<Solution> {
        const fixedCells2 = this.fixedCells.map((x) => this.cellToNumber(x));
        let i = 0;
        for (const sol of dlx(this.size3, 4 * this.size2, this.matrix, fixedCells2)) {
            yield sol.map((x) => this.numberToCell(x));
            i++;
            if (limit !== undefined && i === limit) {
                return;
            }
        }
    }

    private cellToNumber(cell: PosAndVal) {
        return cell.row * this.size2 + cell.col * this.size + cell.value - 1;
    }

    private numberToCell(n: number): PosAndVal {
        return {
            col: Math.floor(n / this.size) % this.size,
            row: Math.floor(n / this.size2),
            value: n % this.size + 1,
        };
    }

    private square(i: number, j: number) {
        return i - i % this.dim + Math.floor(j / this.dim);
    }

    private generateMatrix() {
        const size = this.size;
        const size2 = this.size2;
        let v = 0;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                for (let k = 0; k < this.size; k++) {
                    this.matrix.push([v, i * size + j]);
                    this.matrix.push([v, size2 + i * size + k]);
                    this.matrix.push([v, 2 * size2 + j * size + k]);
                    this.matrix.push([v, 3 * size2 + this.square(i, j) * size + k]);
                    v++;
                }
            }
        }
    }
}

const solve = (n: number, fixedCells: ReadonlyArray<PosAndVal>, limit?: number) => {
    const solver = new Solver(n, fixedCells);
    return solver.solve(limit);
};

export default solve;
