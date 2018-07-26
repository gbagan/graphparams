import {range} from '@fp';

export const Map_dec = (map, key) => {
    let v = map.get(key.toString()) - 1;
    map.set(key.toString(), v);
    return v;
};

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