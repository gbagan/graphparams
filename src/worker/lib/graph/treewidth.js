import {range, times} from '../fp';
import {decode, encode} from '../binary';
import { insert } from '../sorted';

const Q = (g, set, v) => {
    const visited = new Array(g.length)
    const inset = new Array(g.length)
    visited.fill(false)
    inset.fill(false)
    for (const x of set)
        inset[x] = true

    const queue = []
    let nbVisited = 0
    queue.push(v)
    visited[v] = true
    while (queue.length > 0) {
        const u = queue.shift()
        for (const w of g[u]) {
            if (!visited[w]) {
                visited[w] = true
                if (inset[w]) {
                    queue.push(w)
                } else { // if (u !== v) {
                    nbVisited++
                }
            }
        }
    }
    return nbVisited;
}

const treewidth = g => {
    const n = g.length
    let up = n - 1
    const tw = times(() => new Map(), n+1)
    tw[0].set(0, -Infinity)
    for (let i = 1; i <= n; i++) {
        for (const [setid, r] of tw[i - 1].entries()) {
            const set = decode(setid)
            const inset = new Array(n)
            inset.fill(false);
            for (const u of set) {
                inset[u] = true
            }
            for (let x = 0; x < n; x++) {
                if (inset[x]) {
                    continue
                }
                const q = Q(g, set, x) // averifier
                const r2 = Math.max(q, r)
                if (r2 < up) {
                    up = Math.min(up, n - set.length - 1)
                    const setid2 = setid | (1 << x)
                    const t = tw[i].get(setid2);
                    if (t === undefined || t > r2) {
                        tw[i].set(setid2, r2)
                    }
                }
            }
        }
    }
    const vcId = encode(range(0, n))
    return tw[n].get(vcId) || up
}

export default treewidth
