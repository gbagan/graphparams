export const countBy = (list, fn) => {
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

export const max = list => Math.max(...list);

export const maxBy = (list, fn) => {
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