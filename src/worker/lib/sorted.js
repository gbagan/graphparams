export const insert = (list, x) => {
    const index = list.findIndex(y => y >= x);
    if (index === -1)
        return list.concat(x);
    else if (list[index] === x)
        return list;
    else
        return list.slice(0, index).concat(x, ...list.slice(index));
};

export const intersection = (l1, l2) => {
    const res = [];
    let i = 0;
    let j = 0;
    const n = l1.length;
    const m = l2.length;
    while (i < n && j < m) {
        if (l1[i] === l2[j]) {
            res.push(l1[i]);
            i++;
            j++;
        } else if (l1[i] < l2[j]) {
            i++;
        } else {
            j++;
        }
    }
    return res;
};

export const allDifferent = list => {
    let pred = null;
    const n = list.length;
    for (let i = 0; i < n; i++) {
        const x = list[i];
        if (x === pred)
            return false;
        pred = x;
    }
    return true;
};

export const uniq = list => {
    let pred = null;
    const res = [];
    const n = list.length;
    for (let i = 0; i < n; i++) {
        const x = list[i];
        if (x !== pred)
            res.push(x);
        pred = x;
    }
    return res;
}

export const difference = (l1, l2) => {
    const res = []
    let i = 0
    let j = 0
    const n = l1.length
    const m = l2.length
    while (i < n && j < m) {
        const x = l1[i]
        const y = l2[j]
        if (x === y) {
            i++
            j++
        } else if (x < y) {
            res.push(x)
            i++
        } else {
            j++
        }
    }
    while (i < n) {
        res.push(l1[i])
        i++
    }
    return res;
}