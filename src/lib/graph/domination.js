import {range} from '@fp';
import { binaryDecode, binaryEncode } from "../util";

export const dominatingSet = graph => dominationAux(graph, [], range(0, graph.V));

const dominationAux = (graph, preset, undom) => {
    if (undom.length === 0) {
        return { result: preset.length, witness: preset };
    }
    const v = undom[0];
    const nbor = graph.adj[v].concat(v);

    let bestRes = { result: Infinity, witness: null };
    for (const u of nbor) {
        if (preset.includes(u)) {
            continue;
        }
        const undom2 = undom.filter((w) => u !== w && !graph.hasEdge(u, w));
        const res = dominationAux(graph, preset.concat(u), undom2);
        if (res.result < bestRes.result) {
            bestRes = res;
        }
    }
    return bestRes;
}

export const independentDominatingSet = graph => {
    const nbors = [];
    for (const adj of graph.adj) {
        nbors.push(binaryEncode(adj));
    }

    let isets = [[0, 0]];
    let i = 0;
    while (true) {
        const isets2 = [];

        for (const [iset, dom] of isets) {
            const begin = (i === 0) ? 0 : (32 - Math.clz32(iset));
            for (let ii = begin; ii < graph.V; ii++) {
                if ((iset & nbors[ii]) === 0) {
                    const iset2 = iset | (1 << ii);
                    const dom2 = dom | (1 << ii) | nbors[ii];
                    if (dom2 + 1 === (1 << graph.V)) {
                        return { result: i + 1, witness: binaryDecode(iset2) };
                    }
                    isets2.push([iset2, dom2]);
                }
            }
        }
        isets = isets2;
        i++;
    }
}

export const totalDominatingSet = graph => totalDominationAux(g, [], range(0, graph.V));

const totalDominationAux = (graph, preset, undom) => {
    if (undom.length === 0) {
        return { result: preset.length, witness: preset };
    }
    const v = undom[0];
    const nbor = graph.adj[v].concat(v);

    let bestRes = { result: Infinity, witness: null };
    for (const u of nbor) {
        if (preset.includes(u)) {
            continue;
        }
        const undom2 = undom.filter((w) => !graph.hasEdge(u, w));
        const res = totalDominationAux(graph, preset.concat(u), undom2);
        if (res.result < bestRes.result) {
            bestRes = res;
        }
    }
    return bestRes;
}

export const connectedDominatingSet = graph => connectedDominationAux(graph, [], range(0, graph.V), new Set());

const connectedDominationAux = (graph, preset, undom, adj) => {
    if (undom.length === 0) {
        return { result: preset.length, witness: preset };
    }

    const v = 0;
    const candidates = preset.length === 0 ? new Set(graph.adj[v].concat(v)) : adj;

    let bestRes = { result: Infinity, witness: null };
    for (const u of candidates) {
        const undom2 = undom.filter((w) => u !== w && !graph.hasEdge(u, w));
        const adj2 = new Set(adj);
        for (const w of graph.adj[u]) {
            if (!preset.includes(w)) {
                adj2.add(w);
            }
        }
        adj2.delete(u);
        const res = connectedDominationAux(graph, preset.concat(u), undom2, adj2);
        if (res.result < bestRes.result) {
            bestRes = res;
        }
    }
    return bestRes;
}
