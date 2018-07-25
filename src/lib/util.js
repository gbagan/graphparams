import {range} from '@fp';

export const Map_dec = (map, key) => {
    let v = map.get(key.toString()) - 1;
    map.set(key.toString(), v);
    return v;
}

export function* sublists(n, k) {
    if (k === 0) {
        yield [];
    } else if (k <= n) {
        yield * sublists(n - 1, k);
        for (const l of sublists(n - 1, k - 1)) {
            yield l.concat(n - 1);
        }
    }
}

export const uniq = l => {
    let pred = null;
    const l2 = [];
    for (const x of l) {
        if (x !== pred) {
            l2.push(x);
        }
        pred = x;
    }
    return l2;
}

export const allDifferent = l => {
    let pred = null;
    for (const x of l) {
        if (x === pred) {
            return false;
        }
        pred = x;
    }
    return true;
}

export const arrayIntersection = (l1, l2) => {
    const l = [];
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
export function* subsets(n, k) {
    if (k === 0) {
        yield [];
    } else if (n === k) {
        yield range(0, n);
    } else {
        yield* subsets(n - 1, k);
        for (const set of subsets(n - 1, k - 1)) {
            yield set.concat(n - 1);
        }
    }
}

export const binaryEncode = set => {
    let x = 0;
    for (const i of set) {
        x |= (1 << i);
    }
    return x;
}

export const binaryDecode = x => {
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
}

// return subsets of [0, n-1] of size k  encoded in binary

export function* bsubsets(n, k) {
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

export function* permutations(list) {
    if (list.length <= 1) {
        yield list;
    } else {
        for (let i = 0; i < list.length; i++) {
            for (const perm of permutations(list.slice(0, i).concat(list.slice(i + 1, list.length)))) {
                  yield [list[i]].concat(perm);
            }
        }
    }
}