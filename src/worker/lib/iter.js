export function * range(n, m) {
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

export function * map (it, f) {
    for (const x of it) {
        yield f(x);
    }
}

export function * zip(i1, i2) {
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

export function * filter(it, f) {
    for (const x of it) {
        if (f(x)) {
            yield x;
        }
    }
}

export function count(it, f) {
    let i = 0;
    for (const x of it) {
        if (f(x)) {
            i++;
        }
    }
    return i;
}

export function find(it, f) {
    for (const v of it) {
        if (f(v)) {
            return v;
        }
    }
    return null;
}

export function some(it, f) {
    for (const x of it) {
        if (f(x)) {
            return true;
        }
    }
    return false;
}

export function every(it, f) {
    for (const x of it) {
        if (!f(x)) {
            return false;
        }
    }
    return true;
}

export function min(it, f) {
    let bestRes = { elem: null, value: Infinity };
    for (const elem of it) {
        const v = f(elem);
        if (v < bestRes.value) {
            bestRes = { elem, value: v };
        }
    }
    return bestRes;
}

export function max(it, f) {
    let bestRes = { elem: null, value: -Infinity };
    for (const elem of it) {
        const v = f(elem);
        if (v > bestRes.value) {
            bestRes = { elem, value: v };
        }
    }
    return bestRes;
}

export function sum(it) {
    let m = 0;
    for (const v of it) {
        m += v;
    }
    return m;
}

export function isEqual(i1, i2) {
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
