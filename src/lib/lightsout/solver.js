import {times} from '@fp';
import equasSolve from "./equations";

const generateMatrix = (n, m, torus) => {
    const mat = times(_ => Array(n * m), n * m);
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

export default function* solve(conf, nbRows, nbColumns, nbColors, isToric, limit) {
    const conf2 = [];
    for (let i = 0; i < nbRows; i++) {
        for (let j = 0; j < nbColumns; j++) {
            conf2.push((nbColors - conf[i * nbColumns + j]) % nbColors);
        }
    }
    const mat = generateMatrix(nbRows, nbColumns, isToric);
    let ii = 0;
    for (const sol of equasSolve(mat, conf2, nbColors)) {
        yield sol;
        ii++;
        if (limit !== undefined && ii === limit) {
            return;
        }
    }
}
