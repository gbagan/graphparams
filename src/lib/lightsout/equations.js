import {times} from '@fp';

class FiniteFieldEquations {
    constructor(mat, b, k) {
        this.k = k;
        this.mat = mat.map(l => l.slice());
        this.b = b.slice();
        this.n = b.length;
        this.pivots = new Array(this.n);
        this.pivots.fill(-1);

        this.divTable = Array(k);
        for (let i = 0; i < k; i++) {
            this.divTable[i] = Array(k);
            this.divTable[i].fill(-1);
        }
        for (let i = 0; i < k; i++) {
            for (let j = 0; j < k; j++) {
                this.divTable[(i * j) % k][i] = j;
            }
        }
    }

    solvePivotedMatrix() {
        let row = this.n - 1;
        while (this.isEmptyRow(row)) {
            if (this.b[row] !== 0) {
                return [];
            }
            row--;
        }

        const sol = times(() => 0, this.n);
        return this.solvePivotedMatrixAux(sol, row, this.n - 1);
    }

    eliminate() {
        let row = 0;

        for (let col = 0; col < this.n; col++) {
            const pivot = this.findPivotForColumn(col, row);
            if (pivot < 0) {
                continue;
            }
            if (pivot !== row) {
                this.swapRows(pivot, row);
            }
            this.pivots[col] = row;
            this.pivot(row, col);
            row++;
        }
    }

    div(x, y) { // return the division of y by x modulo k if possible else -1
        // TODO there can be multiple solutions
        return this.divTable[x][y];
    }

    findPivotForColumn(col, row) {
        for (let i = row; i < this.n; i++) {
            if (this.mat[i][col] !== 0) {
                return i;
            }
        }
        return -1;
    }

    pivot(row, col) {
        const k = this.k;
        const v = this.mat[row][col];
        for (let i = row + 1; i < this.n; i++) {
            const v2 = this.mat[i][col];
            if (v2 === 0) {
                continue;
            }
            for (let j = 0; j < this.n; j++) {
                this.mat[i][j] = (k * k + v * this.mat[i][j] - v2 * this.mat[row][j]) % k;
            }
            this.b[i] = (k * k + v * this.b[i] - v2 * this.b[row]) % k;
        }
    }

    swapRows(i, j) {
        const n = this.b.length;

        for (let k = 0; k < n; k++) {
            const tmp = this.mat[i][k];
            this.mat[i][k] = this.mat[j][k];
            this.mat[j][k] = tmp;
        }

        const tmp2 = this.b[i];
        this.b[i] = this.b[j];
        this.b[j] = tmp2;
    }

    isEmptyRow(row) {
        for (let i = 0; i < this.n; i++) {
            if (this.mat[row][i] !== 0) {
                return false;
            }
        }
        return true;
    }

    * solvePivotedMatrixAux(sol, row, col) {
        const k = this.k;
        const n = this.n;
        if (row < 0 || col < 0) {
            yield sol;
        } else if (row === this.pivots[col]) {
            let x = this.b[row];
            for (let j = col + 1; j < n; j++) {
                x -= this.mat[row][j] * sol[j];
            }
            x = (x + n * k * k) % k;
            const y = this.mat[row][col];
            const z = this.div(x, y);
            if (z === -1) {
                return;  // if x is not divisible by y modulo k, there is not no solution
            }
            sol[col] = z;
            yield* this.solvePivotedMatrixAux(sol, row === 0 ? 0 : row - 1, col - 1);
        } else {
            for (let i = 0; i < k; i++) {
                const sol2 = Array.from(sol);
                sol2[col] = i;
                yield* this.solvePivotedMatrixAux(sol2, row, col - 1);
            }
        }
    }
}

const solve = (mat, b, k) => {
    const equas = new FiniteFieldEquations(mat, b, k);
    equas.eliminate();
    return equas.solvePivotedMatrix();
};

export default solve;
