import {F, range, times} from '@fp';
import {copy, edgeId} from './graph';

const greedyMatching = graph => {
    const matching = [];
    const matched = times(F, graph.length);

    for (let u = 0; u < graph.length - 1; u++) {
        if (matched[u]) {
            continue;
        }
        for (const v of graph[u]) {
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

const contract = (graph, set) => {
    const g2 = copy(graph);
    const v = set[0];
    const rset = set.slice(1, set.length);
    for (const u of rset) {
        g2[u].length = 0;
    }
    for (let u = 0; u < graph.length; u++) {
        if (rset.includes(u)) {
            continue;
        }
        const adj = g2[u];
        const n = g2[u].length;
        for (let i = 0; i < n; i++) {
            if (rset.includes(adj[i])) {
                adj[i] = v;
            }
        }
    }
    return g2;
}

const findAugmentingPath = (graph, matching) => {
    const parent = times(_ => -1, graph.length);
    const distanceToRoot = times(_ => -1, graph.length);
    const matched = times(_ => -1, graph.length);
    const root = times(_ => -1, graph.length);
    for (const [x, y] of matching) {
        matched[x] = y;
        matched[y] = x;
    }
    for (let i = 0; i < graph.length; i++) {
        if (matched[i] === -1) {
            distanceToRoot[i] = 0;
            parent[i] = i;
            root[i] = i;
        }
    }
    const unexplored = range(0, graph.length).filter(w => matched[w] === -1);

    for (const v of unexplored) {
        if (distanceToRoot[v] % 2 !== 0) {
            continue;
        }
        for (const w of graph[v]) {
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
                const path = [];
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
                    const g2 = contract(graph, path);
                    const m2 = matching.filter(([x]) => !path.includes(x));
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

const maximumMatching = graph => {
    let matching = greedyMatching(graph);
    let path = null;

    while (true) {
        path = findAugmentingPath(graph, matching);
        if (!path) {
            break;
        }
        const excludeSet = new Set();
        for (let i = 0; i < path.length; i++) {
            if (i % 2 === 0) {
                matching.push([path[i], path[i + 1]]);
            } else {
                excludeSet.add(edgeId(graph, path[i], path[i + 1]));
            }
        }
        matching = matching.filter(([x, y]) => !excludeSet.has(edgeId(graph, x, y)));
    }
    return {result: matching.length, witness: matching};
};

export default maximumMatching;
