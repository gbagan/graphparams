export const adjust = (fn, index, list) => {
    if (list === undefined)
        return list2 => adjust(fn, index, list2);
    else if (index === undefined)
        return (index2, list2) => adjust(fn, index2, list2);
    const list2 = list.slice();
    list2[index] = fn(list[index], index);
    return list2;
};

export const all = (fn, list) => {
    if (list === undefined)
        return l2 => all(fn, l2);
    const n = list.length;
    for (let i = 0; i < n; i++) {
        if (!fn(list[i], i))
            return false;
    }
    return true;
};

export const any = (fn, l) => {
    if (l === undefined)
        return l2 => any(fn, l2);
    const n = l.length;
    for (let i = 0; i < n; i++) {
        if (fn(l[i], i))
            return true;
    }
    return false;
};

export const append = (x, l) => l === undefined ? l2 => append(x, l2) : l.concat([x]);

export const chain = (fn, l) => {
    if (l === undefined) {
        return a => chain(fn, a);
    }
    const l2 = [];
    const n = l.length;
    for (let i = 0; i < n; i++) {
        l2.push(...fn(l[i]));
    }
    return l2;
};

export const complement = fn => x => !fn(x);

export const contains = (v, l) => {
    if (l === undefined)
        return l2 => contains(v, l2);
    const n = l.length;
    for (let i = 0; i < n; i++) {
        if (_equals(v, l[i]))
            return true;
    }
    return false;
};

export const countBy = (fn, list) => {
    if (list === undefined)
        return l2 => countBy(fn, l2);
    let count = 0;
    let n = list.length;
    for (let i = 0; i < n; i++) {
        if (fn(list[i], i))
            count++;
    }
    return count;
};

export const curry2 = fn => (x, y) => y === undefined ? y2 => fn(x, y2) : fn(x, y);
export const curry3 = fn => (x, y, z) => {
    if (z === undefined)
        return z2 => fn(x, y, z2);
    else if (y === undefined)
        return (y2, z2) => fn(x, y2, z2);
    else
        return fn(x, y, z);
};

const _equals = (a, b) => {
    if (a === b) {
        return true;
    }
    const typea = typeof a;

    if (typea !== typeof b)
        return false;

    if (Array.isArray(a)) {
        if (!Array.isArray(b)) {
            return false;
        }
        const n = a.length;
        if (n !== b.length)
            return false;
        for (let i = 0; i < n; i++) {
            if (!_equals(a[i], b[i])) {
                return false;
            }
        }
        return true;
    }

    if (a && typea === 'object') {
        const aKeys = Object.keys(a);
        const n = aKeys.length;
        if (n !== Object.keys(b).length) {
            return false;
        }
        for (let i = 0; i < n; i++) {
            const key = aKeys[i];
            if (!_equals(a[key], b[key]))
                return false;
        }
        return true;
    }

    return false;
};

export function equals(a, b) {
    return arguments.length === 1 ? c => _equals(a, c) : _equals(a, b);
}

export const filter = (fn, l) => {
    if (l === undefined) {
        return a => filter(fn, a);
    }
    const t = [];
    const n = l.length;
    for (let i = 0; i < n; i++) {
        const x = l[i];
        if (fn(x, i))
            t.push(x);
    }
    return t;
};

export const find = (fn, l) => {
    if (l === undefined) {
        return l2 => find(fn, l2);
    }
    const n = l.length;
    for (let i = 0; i < n; i++) {
        const x = l[i];
        if (fn(x, i))
            return x;
    }
    return undefined;
};

export const findIndex = (fn, l) => {
    if (l === undefined) {
        return a => findIndex(fn, a);
    }
    const n = l.length;
    for (let i = 0; i < n; i++) {
        if (fn(l[i], i))
            return i;
    }
    return -1;
};

export const forEach = (fn, l) => {
    if (l === undefined) {
        return a => forEach(fn, a);
    }
    const n = l.length;
    for (let i = 0; i < n; i++)
        fn(l[i], i);
};

export const identity = x => x;

export const map = (fn, l) => {
    if (l === undefined) {
        return a => map(fn, a);
    }
    const n = l.length;
    const l2 = new Array(l);
    for (let i = 0; i < n; i++) {
        l2[i] = fn(l[i], i);
    }
    return l2;
};

export const max = list => Math.max(...list);

export const maxBy = (fn, list) => {
    if (list === undefined)
        return l2 => minBy(fn, l2);
    let max = undefined;
    let bestScore = -Infinity;
    let n = list.length;
    for (let i = 0; i < n; i++) {
        const x = list[i];
        const score = fn(x);
        if (score > bestScore) {
            bestScore = score;
            max = x;
        } 
    }
    return max;
};

export const mathMod = (n, m) => n >= 0 ? n % m : (n - n * m) % m;

export const merge = (obj1, obj2) =>
    obj2 === undefined ? obj3 => merge(obj1, obj3) : Object.assign({}, obj1, obj2);

export const min = list => Math.min(...list);

export const minBy = (fn, list) => {
    if (list === undefined)
        return l2 => minBy(fn, l2);
    let min = undefined;
    let bestScore = Infinity;
    let n = list.length;
    for (let i = 0; i < n; i++) {
        const x = list[i];
        const score = fn(x);
        if (score < bestScore) {
            bestScore = score;
            min = x;
        } 
    }
    return min;
};

export const none = (fn, list) => {
    if (list === undefined)
        return l2 => none(fn, l2);
    const n = list.length;
    for (let i = 0; i < n; i++) {
        if (fn(list[i], i))
            return false;
    }
    return true;
};

export const pick = (keys, obj) => {
    if (obj === undefined)
        return obj2 => pick(keys, obj2);

    const keys2 = typeof keys === 'string' ? keys.split(',') : keys;
    const n = keys2.length;

    const obj2 = {};
    
    for (let i = 0; i < n; i++) {
        const key = keys2[i];
        obj2[key] = obj[key];  
    }

    return obj2;
};

export const pipe = (...fns) => val => {
    const n = fns.length;
    let val2 = val;
    for (let i = 0; i < n; i++) {
        val2 = fns[i](val2);
    }
    return val2;
};

export const propEq = (attr, val, obj) => {
    if (obj === undefined)
        return obj2 => propEq(attr, val, obj2);
    else if (val === undefined)
        return (val2, obj2) => propEq(attr, val2, obj2);
    return _equals(obj[attr], val);
};

export const reduce = (fn, init, list) => {
    if (list === undefined)
        return list2 => reduce(fn, init, list2);
    else if (init === undefined)
        return (init2, list2) => reduce(fn, init2, list2);
    const n = list.length;
    let acc = init;
    for (let i = 0; i < n; i++) {
        acc = fn(acc, list[i]);
    }
    return acc;
};

export const removeIndex = (index, list) => {
    if (list === undefined)
        return list2 => removeIndex(index, list2);
    const n = list.length;
    const list2 = Array(n - 1);
    for (let i = 0; i < index; i++) {
        list2[i] = list[i];
    }
    for (let i = index + 1; i < n; i++) {
        list2[i - 1] = list[i];
    }
    return list2;
};

export const sortBy = (fn, list) => 
    list === undefined
        ? list2 => sortBy(fn, list2)
        : list.slice().sort((a, b) => fn(a) - fn(b));

export const sum = l => {
    const n = l.length;
    let x = 0;
    for (let i = 0; i < n; i++) {
        x += l[i];
    }
    return x;
};

export const takeLast = (m, list) => {
    if (list === undefined) {
        return l => takeLast(m, l);
    }
    const n = list.length;
    return n <= m ? list : list.slice(n - m);
};

export const range = (n, m) => {
    const t = Array(m - n);
    for (let i = n; i < m; i++)
        t[i - n] = i;
    return t;
};

export const update = (i, v, l) => {
    if (v === undefined)
        return v === undefined ? (v2, l2) => update(i, v2, l2) : l2 => update(i, v, l2);
    const l2 = l.slice();
    l2[i] = v;
    return l2;
};

export const updateArray = (fn, list) => {
    if (list === undefined)
        return l2 => updateArray(fn, l2);
    const l2 = list.slice();
    fn((i, val) => l2[i] = val);
    return l2;
};

export const whereEq = (whereObj, obj) => {
    if (obj === undefined)
        return obj2 => whereEq(whereObj, obj2);
    const keys = Object.keys(whereObj);
    const n = keys.length;
    for (let i = 0; i < n; i++) {
        const key = keys[i];
        if (!_equals(whereObj[key], obj[key]))
            return false;
    }
    return true;
};

export const times = (fn, n) => {
    const list = Array(n);
    for (let i = 0; i < n; i++) {
        list[i] = fn(i);
    }
    return list;
};

export const zipWith = (fn, list1, list2) => {
    if (list2 === undefined)
        return list1 === undefined
            ? (l1, l2) => zipWith(fn, l1, l2)
            : l2 => zipWith(fn, list1, l2);
    const n = Math.min(list1.length, list2.length);
    const olist = Array(n);
    for (let i = 0; i < n; i++) {
        olist[i] = fn(list1[i], list2[i]);
    }
    return olist;
};