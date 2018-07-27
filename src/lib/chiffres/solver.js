import {range, reduce, times} from '@fp';

const sublists = list => {
    let res = [[]];
    for (const x of list) {
        res = res.concat(res.map((slist) => slist.concat(x)));
    }
    return res;
}

const encodeList = list =>
    reduce((t, x) => t += 1 << x, 0, list);

function computeTable(list, target) {
    const tables = new Array(1 << list.length);
    const indexList = range(0, list.length);
    const slistsTab = times(() => [], list.length+1);
    for (const list2 of sublists(indexList)) {
        slistsTab[list2.length].push(list2);
    }
    let ii = 0;
    for (const elem of list) {
        const table = new Map();
        table.set(elem.val, elem);
        tables[1 << ii] = table;
        ii++;
    }
    ii = 0;
    for (const listsOfSizeI of slistsTab) {
        if (ii <= 1) {
            ii++;
            continue;
        }
        for (const slist of listsOfSizeI) {
            const table = computeTable2(slist, tables);
            if (table.has(target)) {
                return table;
            }
            tables[encodeList(slist)] = table;
        }
        ii++;
    }
    return tables[(1 << list.length) - 1];
}

function computeTable2(list, tables) {
    const table = new Map();
    const slists = sublists(list);
    const n = slists.length;
    const n2 = Math.floor(n / 2);
    for (let k = 1; k <= n2; k++) {
        const list1 = slists[k];
        const list2 = slists[n - 1 - k];
        const table1 = tables[encodeList(list1)];
        const table2 = tables[encodeList(list2)];
        for (const [i, e1] of table1.entries()) {
            for (const [j, e2] of table2.entries()) {
                table.set(i + j, { val: i + j, left: e1, operator: '+', right: e2 });
                table.set(i * j, { val: i * j, left: e1, operator: '*', right: e2 });
                if (i > j) {
                    table.set(i - j, { val: i - j, left: e1, operator: '-', right: e2 });
                    if (i % j === 0) {
                        table.set(i / j, { val: i / j, left: e1, operator: '/', right: e2 });
                    }
                } else {
                    table.set(j - i, { val: j - i, left: e2, operator: '-', right: e1 });
                    if (j % i === 0) {
                        table.set(j / i, { val: j / i, left: e2, operator: '/', right: e1 });
                    }
                }
                table.set(j, e2);
                table.set(i, e1);
            }
        }
    }
    return table;
}

const solve = (values, target) => {
    let bestDiff = Infinity;
    let bestCalc = null;
    const values2 = values.map(val => ({val}));
    for (const [value, calc] of computeTable(values2, target)) {
        const diff = Math.abs(value - target);
        if (diff < bestDiff) {
            bestDiff = diff;
            bestCalc = calc;
        }
    }
    return bestCalc;
};

export default solve;