import {times} from '@fp';
import { allDifferent, binaryDecode, binaryEncode, bsubsets } from "../util";

const isIdentifyingCode = (g, binNbors, bset) => {
    const nborInSet = [];
    for (let i = 0; i < g.V; i++) {
        const s = binNbors[i] & bset;
        if (s === 0) {
            return false;
        }
        nborInSet.push(s);
    }
    return allDifferent(nborInSet.sort());
}

export const identifyingCode = g => {
    const binNbors = times(j => binaryEncode(g.adj[j].concat(j)), g.V);
    if (!allDifferent(binNbors.sort())) {
        return { result: Infinity, witness: null };
    }
    let i = 1;
    while (true) {
        for (const bset of bsubsets(g.V, i)) {
            if (isIdentifyingCode(g, binNbors, bset)) {
                return { result: i, witness: binaryDecode(bset) };
            }
        }
        i++;
    }
}

const isLocatingDominatingSet = (g, binNbors, bset) => {
    const nborInSet = [];
    for (let i = 0; i < g.V; i++) {
        if (((1 << i) & bset) === 0) {
            const s = binNbors[i] & bset;
            if (s === 0) {
                return false;
            }
            nborInSet.push(s);
        }
    }
    return allDifferent(nborInSet.sort());
}

export const locatingDominatingSet = g => {
    const binNbors = [];
    for (const nbor of g.adj) {
        binNbors.push(binaryEncode(nbor));
    }

    let i = 1;
    while (true) {
        for (const bset of bsubsets(g.V, i)) {
            if (isLocatingDominatingSet(g, binNbors, bset)) {
                return { result: i, witness: binaryDecode(bset) };
            }
        }
        i++;
    }
}
