import {range} from "./iter";

export function Map_dec<T>(m: Map<string, number>, key: T) {
    let v = m.get(key.toString()) as number;
    v--;
    m.set(key.toString(), v);
    return v;
}

export function* sublists(n: number, k: number): Iterable<number[]> {
    if (k === 0) {
        yield [];
    } else if (k <= n) {
        yield * sublists(n - 1, k);
        for (const l of sublists(n - 1, k - 1)) {
            yield l.concat(n - 1);
        }
    }
}

export function uniq<T>(l: ReadonlyArray<T>) {
    let pred: T | null = null;
    const l2: T[] = [];
    for (const x of l) {
        if (x !== pred) {
            l2.push(x);
        }
        pred = x;
    }
    return l2;
}

export function allDifferent<T>(l: ReadonlyArray<T>) {
    let pred: T | null = null;
    for (const x of l) {
        if (x === pred) {
            return false;
        }
        pred = x;
    }
    return true;
}

export function arrayIntersection<T>(l1: ReadonlyArray<T>, l2: ReadonlyArray<T>) {
    const l: T[] = [];
    let i = 0;
    let j = 0;
    while (i < l1.length && j < l2.length) {
        if (l1[i] === l2[j]) {
            l.push(l1[i]);
            i++;
            j++;
        } else if (l1[i] < l2[j]) {
            i++;
        } else {
            j++;
        }
    }
    return l;
}

// return subsets of [0, n-1] of size k
export function* subsets(n: number, k: number): Iterable<number[]> {
    if (k === 0) {
        yield [];
    } else if (n === k) {
        yield Array.from(range(n));
    } else {
        yield* subsets(n - 1, k);
        for (const set of subsets(n - 1, k - 1)) {
            yield set.concat(n - 1);
        }
    }
}

export function binaryEncode(set: ReadonlyArray<number>) {
    let x = 0;
    for (const i of set) {
        x |= (1 << i);
    }
    return x;
}

export function binaryDecode(x: number) {
    const s: number[] = [];
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
}

// return subsets of [0, n-1] of size k  encoded in binary

export function* bsubsets(n: number, k: number): Iterable<number> {
    if (k === 0) {
        yield 0;
    } else if (n === k) {
        yield (1 << n) - 1;
    } else {
        yield* bsubsets(n - 1, k);
        for (const set of bsubsets(n - 1, k - 1)) {
            yield set | (1 << (n - 1));
        }
    }
}
