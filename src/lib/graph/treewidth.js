import {F, range, times} from '@fp';
import { binaryDecode, binaryEncode } from "../util";
// import { cliqueNumber } from "./basic";
import Graph from "./graph";

const Q = (g, set, v) => {
    const visited = times(F, g.V);
    const inset = times(F, g.V);
    for (const x of set)
        inset[x] = true;

    const queue = [];
    let nbVisited = 0;
    queue.push(v);
    visited[v] = true;
    while (queue.length > 0) {
        const u = queue.shift();
        for (const w of g.adj[u]) {
            if (!visited[w]) {
                visited[w] = true;
                if (inset[w]) {
                    queue.push(w);
                } else { // if (u !== v) {
                    nbVisited++;
                }
            }
        }
    }
    return nbVisited;
}

const treewidth = g => {
    const n = g.V;
    let up = n - 1;
    const tw = times(_ => new Map(), n);
    tw[0].set(0, -Infinity);
    for (let i = 1; i <= n; i++) {
        for (const [setid, r] of tw[i - 1].entries()) {
            const set = binaryDecode(setid);
            const inset = new Array(n);
            inset.fill(false);
            for (const u of set) {
                inset[u] = true;
            }
            for (let x = 0; x < n; x++) {
                if (inset[x]) {
                    continue;
                }
                const q = Q(g, set, x); // averifier
                const r2 = Math.max(q, r);
                if (r2 < up) {
                    up = Math.min(up, n - set.length - 1);
                    const setid2 = setid | (1 << x);
                    const t = tw[i].get(setid2);
                    if (t === undefined || t > r2) {
                        tw[i].set(setid2, r2);
                    }
                }
            }
        }
    }
    // const vcId = binaryEncode([...iter.range(n)]) - binaryEncode(clique);
    const vcId = binaryEncode(range(n));
    return tw[n].get(vcId) || up;
}

export default treewidth;
