import {times} from '../fp';
import {allDifferent} from '../sorted';
import {decode, encode, subsets} from '../binary';

const isIdentifyingCode = (g, binNbors, bset) => {
    const nborInSet = []
    for (let i = 0; i < g.length; i++) {
        const s = binNbors[i] & bset;
        if (s === 0) {
            return false
        }
        nborInSet.push(s)
    }
    return allDifferent(nborInSet.sort((a, b) => a - b))
}

export const identifyingCode = g => {
    const binNbors = times(j => encode(g[j].concat(j)), g.length);
    if (!allDifferent(binNbors.sort((a, b) => a - b))) {
        return { result: -1, wtype: "nowitness", witness: [] };
    }
    let i = 1;
    while (true) {
        for (const bset of subsets(g.length, i)) {
            if (isIdentifyingCode(g, binNbors, bset)) {
                return { result: i, wtype: "set", witness: decode(bset) };
            }
        }
        i++;
    }
}

const isLocatingDominatingSet = (g, binNbors, bset) => {
    const nborInSet = [];
    for (let i = 0; i < g.length; i++) {
        if (((1 << i) & bset) === 0) {
            const s = binNbors[i] & bset
            if (s === 0) {
                return false
            }
            nborInSet.push(s)
        }
    }
    return allDifferent(nborInSet.sort((a, b) => a - b))
}

export const locatingDominatingSet = g => {
    const binNbors = [];
    for (const nbor of g) {
        binNbors.push(encode(nbor))
    }

    let i = 1
    while (true) {
        for (const bset of subsets(g.length, i)) {
            if (isLocatingDominatingSet(g, binNbors, bset)) {
                return { result: i, wtype: "set", witness: decode(bset) }
            }
        }
        i++
    }
}
