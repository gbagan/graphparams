export const encode = set => {
    let x = 0;
    for (const i of set) {
        x |= (1 << i);
    }
    return x;
};

export const decode = x => {
    const s = [];
    let y = x;
    let i = 0;
    while (y > 0) {
        if ((y & 1) === 1) {
            s.push(i);
        }
        i++;
        y >>= 1;
    }
    return s;
};

// return subsets of [0, n-1] of size k  encoded in binary

export function* subsets(n, k) {
    if (k === 0) {
        yield 0;
    } else if (n === k) {
        yield (1 << n) - 1;
    } else {
        yield* subsets(n - 1, k);
        for (const set of subsets(n - 1, k - 1)) {
            yield set | (1 << (n - 1));
        }
    }
}