import { allDifferent, binaryDecode, binaryEncode, bsubsets } from "../util";
import Graph from "./graph";
import { Result } from "./types";

function isIdentifyingCodeOpt(g: Graph, binNbors: number[], bset: number) {
    const nborInSet: number[] = [];
    for (let i = 0; i < g.V; i++) {
        const s = binNbors[i] & bset;
        if (s === 0) {
            return false;
        }
        nborInSet.push(s);
    }
    nborInSet.sort();
    return allDifferent(nborInSet);
}

export function identifyingCodeOpt(g: Graph): Result {
    const binNbors: number[] = [];
    for (let j = 0; j < g.V; j++) {
        binNbors.push(binaryEncode(g.adj(j).concat(j)));
    }
    let i = 1;
    while (true) {
        for (const bset of bsubsets(g.V, i)) {
            if (isIdentifyingCodeOpt(g, binNbors, bset)) {
                return { result: i, witness: binaryDecode(bset) };
            }
        }
        i++;
    }
}

export function isLocatingDominatingSet(g: Graph, binNbors: number[], bset: number) {
    const nborInSet: number[] = [];
    for (let i = 0; i < g.V; i++) {
        if (((1 << i) & bset) === 0) {
            const s = binNbors[i] & bset;
            if (s === 0) {
                return false;
            }
            nborInSet.push(s);
        }
    }
    nborInSet.sort();
    return allDifferent(nborInSet);
}

export function locatingDominatingSet(g: Graph): Result {
    const binNbors: number[] = [];
    for (const nbor of g.adjs()) {
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
