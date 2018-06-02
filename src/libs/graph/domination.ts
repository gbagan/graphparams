import {range} from "../iter";
import Graph from "./graph";
import { Result } from "./types";
import { binaryDecode, binaryEncode } from "./util";

export function independentDominatingSetOpt(g: Graph) {
    const nbors: number[] = [];
    for (const adj of g.adjs()) {
        nbors.push(binaryEncode(adj));
    }

    let isets: Array<[number, number]> = [[0, 0]];
    let i = 0;
    while (true) {
        const isets2: Array<[number, number]> = [];

        for (const [iset, dom] of isets) {
            const begin = (i === 0) ? 0 : (32 - Math.clz32(iset));
            for (let ii = begin; ii < g.V; ii++) {
                if ((iset & nbors[ii]) === 0) {
                    const iset2 = iset | (1 << ii);
                    const dom2 = dom | (1 << ii) | nbors[ii];
                    if (dom2 + 1 === (1 << g.V)) {
                        return { result: i, witness: binaryDecode(iset2) };
                    }
                    isets2.push([iset2, dom2]);
                }
            }
        }
        isets = isets2;
        i++;
    }
}

export const dominatingSet = (g: Graph) => dominationAux(g, [], [...range(g.V)]);

function dominationAux(g: Graph, preset: number[], undom: number[]): Result {
    if (undom.length === 0) {
        return { result: preset.length, witness: preset };
    }
    const v = undom[0];
    const nbor = g.adj(v).concat(v);

    let bestRes: Result = { result: Infinity, witness: null };
    for (const u of nbor) {
        if (preset.includes(u)) {
            continue;
        }
        const undom2 = undom.filter((w) => u !== w && !g.hasEdge(u, w));
        const res = dominationAux(g, preset.concat(u), undom2);
        if (res.result < bestRes.result) {
            bestRes = res;
        }
    }
    return bestRes;
}

export const totalDominatingSet = (g: Graph) => totalDominationAux(g, [], [...range(g.V)]);

function totalDominationAux(g: Graph, preset: number[], undom: number[]): Result {
    if (undom.length === 0) {
        return { result: preset.length, witness: preset };
    }
    const v = undom[0];
    const nbor = g.adj(v).concat(v);

    let bestRes: Result = { result: Infinity, witness: null };
    for (const u of nbor) {
        if (preset.includes(u)) {
            continue;
        }
        const undom2 = undom.filter((w) => !g.hasEdge(u, w));
        const res = totalDominationAux(g, preset.concat(u), undom2);
        if (res.result < bestRes.result) {
            bestRes = res;
        }
    }
    return bestRes;
}

export const connectedDominatingSet = (g: Graph) => connectedDominationAux(g, [], [...range(g.V)], new Set());

function connectedDominationAux(g: Graph, preset: number[], undom: number[], adj: Set<number>): Result {
    if (undom.length === 0) {
        return { result: preset.length, witness: preset };
    }

    const v = 0;
    const candidates = preset.length === 0 ? new Set(g.adj(v).concat(v)) : adj;

    let bestRes: Result = { result: Infinity, witness: null };
    for (const u of candidates) {
        const undom2 = undom.filter((w) => u !== w && !g.hasEdge(u, w));
        const adj2 = new Set<number>(adj);
        for (const w of g.adj(u)) {
            if (!preset.includes(w)) {
                adj2.add(w);
            }
        }
        adj2.delete(u);
        const res = connectedDominationAux(g, preset.concat(u), undom2, adj2);
        if (res.result < bestRes.result) {
            bestRes = res;
        }
    }
    return bestRes;
}
