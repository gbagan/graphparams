import equasSolve from "./equations";

function generateMatrix(n: number, m: number, torus?: boolean): number[][] {
    const mat: number[][] = new Array(n * m);
    for (let i = 0; i < mat.length; i++) {
        mat[i] = new Array(n * m);
    }
    for (let i1 = 0; i1 < n; i1++) {
        for (let j1 = 0; j1 < m; j1++) {
            for (let i2 = 0; i2 < n; i2++) {
                for (let j2 = 0; j2 < m; j2++) {
                    const test = Math.abs(i1 - i2) + Math.abs(j1 - j2) <= 1;
                    const test2 = test ||
                        torus && ((Math.abs(i1 - i2) === n - 1 && j1 === j2)
                            || (Math.abs(j1 - j2) === m - 1 && i1 === i2));
                    mat[i1 * m + j1][i2 * m + j2] = test2 ? 1 : 0;
                }
            }
        }
    }
    return mat;
}

export default function* solve(conf: number[], rows: number, columns: number, nbColors: number,
                               torus: boolean = false, limit?: number): Iterable<number[]> {
    const conf2: number[] = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            conf2.push((nbColors - conf[i * columns + j]) % nbColors);
        }
    }
    const mat = generateMatrix(rows, columns, torus);
    let ii = 0;
    for (const sol of equasSolve(mat, conf2, nbColors)) {
        yield sol;
        ii++;
        if (limit !== undefined && ii === limit) {
            return;
        }
    }
}
