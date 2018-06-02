export function * range(n: number, m?: number) {
    if (m === undefined) {
        for (let i = 0; i < n; i++) {
            yield i;
        }
    } else {
        for (let i = n; i < m; i++) {
            yield i;
        }
    }
}

export function * map<T1, T2>(it: Iterable<T1>, f: (x: T1) => T2): Iterable<T2> {
    for (const x of it) {
        yield f(x);
    }
}

export function* permutations<T>(list: ReadonlyArray<T>): Iterable<ReadonlyArray<T>> {
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

export function * zip<T1, T2>(i1: Iterable<T1>, i2: Iterable<T2>): Iterable<Readonly<[T1, T2]>> {
    const it1 = i1[Symbol.iterator]();
    const it2 = i2[Symbol.iterator]();

    while (true) {
        const res1 = it1.next();
        const res2 = it2.next();
        if (res1.done || res2.done) {
            return;
        }
        yield [res1.value, res2.value];
    }
}

export function * filter<T>(it: Iterable<T>, f: (x: T) => boolean) {
    for (const x of it) {
        if (f(x)) {
            yield x;
        }
    }
}

export function count<T>(it: Iterable<T>, f: (x: T) => boolean): number {
    let i = 0;
    for (const x of it) {
        if (f(x)) {
            i++;
        }
    }
    return i;
}

export function iterfind<T>(it: Iterable<T>, f: (x: T) => boolean): T | null {
    for (const v of it) {
        if (f(v)) {
            return v;
        }
    }
    return null;
}

export function some<T>(it: Iterable<T>, f: (x: T) => boolean) {
    for (const x of it) {
        if (f(x)) {
            return true;
        }
    }
    return false;
}

export function min<T>(it: Iterable<T>, f: (x: T) => number) {
    let bestRes: { elem: T | null, value: number } = { elem: null, value: Infinity };
    for (const elem of it) {
        const v = f(elem);
        if (v < bestRes.value) {
            bestRes = { elem, value: v };
        }
    }
    return bestRes as { elem: T, value: number };
}

export function max<T>(it: Iterable<T>, f: (x: T) => number) {
    let bestRes: { elem: T | null, value: number } = { elem: null, value: -Infinity };
    for (const elem of it) {
        const v = f(elem);
        if (v > bestRes.value) {
            bestRes = { elem, value: v };
        }
    }
    return bestRes as { elem: T, value: number };
}

export function sum<T>(it: Iterable<T>, f: (x: T) => number) {
    let m = 0;
    for (const v of it) {
        m += f(v);
    }
    return m;
}

export function isEqual<T>(i1: Iterable<T>, i2: Iterable<T>): boolean {
    const it1 = i1[Symbol.iterator]();
    const it2 = i2[Symbol.iterator]();

    while (true) {
        const res1 = it1.next();
        const res2 = it2.next();
        if (res1.done && res2.done) {
            return true;
        } else if (res1.done || res2.done || res1.value !== res2.value) {
            return false;
        }
    }
}
