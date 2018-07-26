import {F, map, max, maxBy, min, sum, range, times} from '@fp';
import {binaryDecode, binaryEncode} from '../util';
import {edges, hasEdge} from './graph';
import {complement} from './operators';

export const nbVertices = graph => graph.length;
export const nbEdges = graph => sum(map(nbor => nbor.length, graph)) / 2;
export const minDegree = graph => min(map(nbor => nbor.length, graph));
export const maxDegree = graph => max(map(nbor => nbor.length, graph));
export const isRegular = graph  => minDegree(graph) === maxDegree(graph);

export const isConnected = graph => {
    const visited = times(F, graph.length);
    const stack = [];
    let nbVisited = 1;
    visited[0] = true;
    stack.push(0);
    while (stack.length > 0) {
        const u = stack.pop();
        for (const w of graph[u]) {
            if (!visited[w]) {
                stack.push(w);
                visited[w] = true;
                nbVisited++;
            }
        }
    }
    return nbVisited === graph.length;
};

export const isHamiltonian = graph => graph.length === 1 && { result: true, witness: [0] }
                                        || graph.length === 2  && { result: false, witness: null }
                                        || hamiltonAux(graph, [0]);

const hamiltonAux = (graph, path) => {
    const last = path[path.length - 1];
    if (path.length === graph.length) {
        return graph.length === 1 || hasEdge(graph, path[0], last) ?
            { result: true, witness: path } : { result: false, witness: null };
    } else {
        for (const v of graph[last]) {
            if (path.includes(v)) {
                continue;
            }
            const res = hamiltonAux(graph, path.concat(v));
            if (res.result) {
                return res;
            }
        }
        return { result: false, witness: null };
    }
};

export const degeneracy = graph => {
    const set = new Set(range(0, graph.length));
    const order = [];
    let maxdegree = 0;
    while (set.size > 0) {
        let minDeg = Infinity;
        let bestVertex = null;
        for (const v of set) {
            const degree = sum(map(u => set.has(u) ? 1: 0, graph[v]));
            if (degree < minDeg) {
                bestVertex = v;
                minDeg = degree;
            }
        }
        set.delete(bestVertex);
        order.push(bestVertex);
        maxdegree = Math.max(maxdegree, minDeg);
    }

    return { result: maxdegree, witness: order };
};

export const eccentricity = (graph, vertex) => {
    const distance = times(_ => -1, graph.length);
    const parent = times(_ => -1, graph.length);
    const queue = [];
    let nbVisited = 1;
    distance[vertex] = 0;
    queue.push(vertex);
    while (queue.length > 0) {
        const u = queue.shift();
        for (const w of graph[u]) {
            if (distance[w] === -1) {
                queue.push(w);
                distance[w] = distance[u] + 1;
                parent[w] = u;
                nbVisited++;
            }
        }
    }

    if (nbVisited !== graph.length) {
        return { result: Infinity, witness: null };
    } else {
        let u = maxBy(w => distance[w], range(0, graph.length));
        const path = [u];
        while (u !== vertex) {
            u = parent[u];
            path.push(u);
        }

        return { result: path.length - 1, witness: path.reverse() };
    }
};

export const alternativePath = (graph, v1, v2) => {
    const distance = times(() => -1, graph.length);
    const parent = times(() => -1, graph.length);
    const queue = [];
    distance[v1] = 0;
    queue.push(v1);
    while (queue.length > 0) {
        const u = queue.shift();
        for (const w of graph[u]) {
            if (u === v1 && w === v2) {
                continue;
            }
            if (distance[w] === -1) {
                queue.push(w);
                distance[w] = distance[u] + 1;
                parent[w] = u;
            }
        }
    }

    if (distance[v2] === -1) {
        return { result: Infinity, witness: null };
    } else {
        const path = [v2];
        let u = v2;
        while (u !== v1) {
            u = parent[u];
            path.push(u);
        }

        return { result: path.length - 1, witness: path };
    }
};

export const girth = graph => {
    let bestRes = { result: Infinity, witness: null };
    for (const [u, v] of edges(graph)) {
        const res = alternativePath(graph, u, v);
        if (res.result !== Infinity && res.result + 1 < bestRes.result) {
            bestRes = { result: res.result + 1, witness: res.witness };
        }
    }
    return bestRes;
};

export const diameter = graph => {
    let bestRes = { result: -1, witness: null };
    for (let i = 0; i < graph.length; i++) {
        const res = eccentricity(graph, i);
        if (res.result > bestRes.result) {
            bestRes = res;
        }
    }
    return bestRes;
};

export const mis = graph => {
    let isets = [0];
    let i = 0;
    const nbors = graph.map(adj => binaryEncode(adj));

    while (true) {
        const isets2 = [];

        for (const iset of isets) {
            const begin = (i === 0) ? 0 : (32 - Math.clz32(iset));
            for (let ii = begin; ii < graph.length; ii++) {
                if ((iset & nbors[ii]) === 0) {
                    isets2.push(iset | (1 << ii));
                }
            }
        }
        if (isets2.length === 0) {
            return { result: i, witness: binaryDecode(isets[0]) };
        }
        isets = isets2;
        i++;
    }
};

// const cliqueNumberNonOpt = (g: Graph) => mis(complement(g).freeze());
export const cliqueNumber = graph => mis(complement(graph));
