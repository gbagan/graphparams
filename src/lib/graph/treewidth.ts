import {range} from "../iter";
import { binaryDecode, binaryEncode } from "../util";
// import { cliqueNumber } from "./basic";
import Graph from "./graph";

function Q(g: Graph, set: number[], v: number) {
    const visited: boolean[] = new Array(g.V);
    const inset: boolean[] = new Array(g.V);
    visited.fill(false);
    inset.fill(false);
    for (const x of set) {
        inset[x] = true;
    }

    const queue = new Array<number>();
    let nbVisited = 0;
    queue.push(v);
    visited[v] = true;
    while (queue.length > 0) {
        const u = queue.shift()!;
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

function treewidth(g: Graph): number {
    const n = g.V;
    let up = n - 1;
    const tw = new Array<Map<number, number>>(n);
    tw[0] = new Map();
    tw[0].set(0, -Infinity);
    for (let i = 1; i <= n; i++) {
        tw[i] = new Map();
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
    const vcId = binaryEncode([...range(n)]);
    return tw[n].get(vcId) || up;
}

export default treewidth;
