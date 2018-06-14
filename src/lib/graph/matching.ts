import { range } from "../iter";
import Graph from "./graph";
import {copy} from "./operators";
import { Result } from "./types";

function greedyMatching(g: Graph) {
    const matching: Array<[number, number]> = [];
    const matched = new Array<boolean>(g.V);
    matched.fill(false);

    for (let u = 0; u < g.V - 1; u++) {
        if (matched[u]) {
            continue;
        }
        for (const v of g.adj[u]) {
            if (u < v && !matched[v]) {
                matching.push([u, v]);
                matched[u] = true;
                matched[v] = true;
                break;
            }
        }
    }
    return matching;
}

function contract(g: Graph, set: number[]) {
    const g2 = copy(g);
    const v = set[0];
    const rset = set.slice(1, set.length);
    for (const u of rset) {
        g2.adj[u].length = 0;
    }
    for (let u = 0; u < g.V; u++) {
        if (rset.includes(u)) {
            continue;
        }
        const adj = g2.adj[u];
        const n = g2.adj[u].length;
        for (let i = 0; i < n; i++) {
            if (rset.includes(adj[i])) {
                adj[i] = v;
            }
        }
    }
    return g2;
}

function findAugmentingPath(g: Graph, m: Array<[number, number]>): number[] | null {
    const parent = new Array<number>(g.V);
    const distanceToRoot = new Array<number>(g.V);
    const matched = new Array<number>(g.V);
    const root = new Array<number>(g.V);
    parent.fill(-1);
    distanceToRoot.fill(-1);
    matched.fill(-1);
    root.fill(-1);
    for (const [x, y] of m) {
        matched[x] = y;
        matched[y] = x;
    }
    for (let i = 0; i < g.V; i++) {
        if (matched[i] === -1) {
            distanceToRoot[i] = 0;
            parent[i] = i;
            root[i] = i;
        }
    }
    const unexplored: number[] = [...range(g.V)].filter(w => matched[w] === -1);

    for (const v of unexplored) {
        if (distanceToRoot[v] % 2 !== 0) {
            continue;
        }
        for (const w of g.adj[v]) {
            if (matched[w] === v) {
                continue;
            } else if (root[w] === -1) {
                const x = matched[w];
                parent[w] = v;
                distanceToRoot[w] = distanceToRoot[v] + 1;
                parent[x] = w;
                distanceToRoot[x] = distanceToRoot[w] + 1;
                root[x] = root[w] = root[v];
                unexplored.push(w);  ///////
                unexplored.push(x);  //////
            } else if (distanceToRoot[w] % 2 === 0) {
                // create a path  root(v) -- ... -- v --w -- .... -- root(w)
                const path: number[] = [];
                let v1 = v;
                while (parent[v1] !== v1) {
                    path.unshift(v1);
                    v1 = parent[v1];
                }
                path.unshift(v1);
                let w1 = w;
                while (parent[w1] !== w1) {
                    path.push(w1);
                    w1 = parent[w1];
                }
                path.push(w1);

                if (root[v] !== root[w]) {
                    return path;
                } else {
                    const g2 = contract(g, path);
                    const m2 = m.filter(([x]) => !path.includes(x));
                    const path2 = findAugmentingPath(g2, m2);
                    if (!path2) {
                        return null;
                    }
                    // TODO
                    // return lift(path2)
                }
            }
        }
    }
    return null;
}

export default function maximumMatching(g: Graph): Result {
    let m = greedyMatching(g);
    let path: number[] | null = null;

    while (true) {
        path = findAugmentingPath(g, m);
        if (!path) {
            break;
        }
        const excludeSet = new Set<number>();
        for (let i = 0; i < path.length; i++) {
            if (i % 2 === 0) {
                m.push([path[i], path[i + 1]]);
            } else {
                excludeSet.add(g.edgeId(path[i], path[i + 1]));
            }
        }
        m = m.filter(([x, y]) => !excludeSet.has(g.edgeId(x, y)));
    }
    const t: number[] = [];
    return { result: m.length, witness: t.concat(...m) };
}
