export function array2<T>(n: number, m: number, fn: (i: number, j: number) => T) {
    const t: T[][] = new Array(n);
    for (let i = 0; i < n; i++) {
        t[i] = new Array(m);
        for (let j = 0; j < n; j++) {
            t[i][j] = fn(i, j);
        }
    }
    return t;
}

export function map2<T,T2>(array: T[][], fn: (val: T, i: number, j: number) => T2): T2[] {
    const t: T2[] = [];
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            t.push(fn(array[i][j], i, j));
        }
    }
    return t;
}
