import * as iter from "../iter";
import Graph from "./graph";
import {complement} from "./operators";
import {Result} from "./types";
import {binaryDecode, binaryEncode} from "./util";

export const nbVertices = (g: Graph) => g.V;
export const nbEdges = (g: Graph) => iter.sum(g.adjs(), nbor => nbor.length) / 2;
export const minDegree = (g: Graph) => iter.min(g.adjs(), nbor => nbor.length).value;
export const maxDegree = (g: Graph) => iter.max(g.adjs(), nbor => nbor.length).value;
export const isRegular = (g: Graph)  => minDegree(g) === maxDegree(g);

export function isConnected(g: Graph) {
    const visited = new Array<boolean>(g.V);
    const stack = new Array<number>();
    let nbVisited = 1;
    visited[0] = true;
    stack.push(0);
    while (stack.length > 0) {
        const u = stack.pop()!;
        for (const w of g.adj(u)) {
            if (!visited[w]) {
                stack.push(w);
                visited[w] = true;
                nbVisited++;
            }
        }
    }
    return nbVisited === g.V;
}

export const isHamiltonian = (g: Graph) => hamiltonAux(g, [0]);

function hamiltonAux(g: Graph, path: number[]): Result {
    const last = path[path.length - 1];
    if (path.length === g.V) {
        return g.hasEdge(path[0], last) ? { result: true, witness: path } : { result: false, witness: null };
    } else {
        for (const v of g.adj(last)) {
            if (path.includes(v)) {
                continue;
            }
            const res = hamiltonAux(g, path.concat(v));
            if (res.result) {
                return res;
            }
        }
        return { result: false, witness: null };
    }
}

export function degeneracy(g: Graph): Result {
    const set = new Set(iter.range(g.V));
    const order: number[] = [];
    let maxdegree = 0;
    while (set.size > 0) {
        let minDeg = Infinity;
        let bestVertex = null;
        for (const v of set) {
            const degree = iter.count<number>(g.adj(v), u => set.has(u));
            if (degree < minDeg) {
                bestVertex = v;
                minDeg = degree;
            }
        }
        set.delete(bestVertex!);
        order.push(bestVertex!);
        if (minDeg > maxdegree) {
            maxdegree = minDeg;
        }
    }

    return { result: maxdegree, witness: order };
}

export function eccentricity(g: Graph, v: number): Result {
    const distance = new Array<number>(g.V);
    const parent = new Array<number>(g.V);
    distance.fill(-1);
    parent.fill(-1);
    const queue = new Array<number>();
    let nbVisited = 1;
    distance[v] = 0;
    queue.push(v);
    while (queue.length > 0) {
        const u = queue.shift()!;
        for (const w of g.adj(u)) {
            if (distance[w] === -1) {
                queue.push(w);
                distance[w] = distance[u] + 1;
                parent[w] = u;
                nbVisited++;
            }
        }
    }

    if (nbVisited !== g.V) {
        return { result: Infinity, witness: null };
    } else {
        let u = iter.max(iter.range(g.V), w => distance[w]).elem;
        const path = [u];
        while (u !== v) {
            u = parent[u];
            path.push(u);
        }

        return { result: path.length - 1, witness: path.reverse() };
    }
}

export function alternativePath(g: Graph, v1: number, v2: number) {
    const distance = new Array<number>(g.V);
    const parent = new Array<number>(g.V);
    distance.fill(-1);
    parent.fill(-1);
    const queue = new Array<number>();
    distance[v1] = 0;
    queue.push(v1);
    while (queue.length > 0) {
        const u = queue.shift()!;
        for (const w of g.adj(u)) {
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
}

export function girth(g: Graph): Result {
    let bestRes: Result = { result: Infinity, witness: null };
    for (const [u, v] of g.edges()) {
        const res = alternativePath(g, u, v);
        if (res.result !== Infinity && res.result + 1 < bestRes.result!) {
            bestRes = { result: res.result + 1, witness: res.witness };
        }
    }
    return bestRes;
}

export function diameter(g: Graph): Result {
    let bestRes: Result = { result: -1, witness: null };
    for (let i = 0; i < g.V; i++) {
        const res = eccentricity(g, i);
        if (res.result! > bestRes.result!) {
            bestRes = res;
        }
    }
    return bestRes;
}

export function mis(g: Graph): Result {
    let isets: number[][] = [[]];
    let i = 0;
    while (true) {
        const isets2: number[][] = [];

        for (const iset of isets) {
            const size = iset.length;
            const begin = size === 0 ? 0 : iset[size - 1] + 1;
            for (let ii = begin; ii < g.V; ii++) {
                if (iset.every((jj) => !g.hasEdge(ii, jj))) {
                    isets2.push(iset.concat(ii));
                }
            }
        }
        if (isets2.length === 0) {
            return { result: i, witness: isets[0] };
        }
        isets = isets2;
        i++;
    }
}

export function misOpt(g: Graph): Result {
    let isets: number[] = [0];
    let i = 0;
    const nbors: number[] = [];
    for (const adj of g.adjs()) {
        nbors.push(binaryEncode(adj));
    }

    while (true) {
        const isets2: number[] = [];

        for (const iset of isets) {
            const begin = (i === 0) ? 0 : (32 - Math.clz32(iset));
            for (let ii = begin; ii < g.V; ii++) {
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
}

export const cliqueNumber = (g: Graph) => mis(complement(g).freeze());
export const cliqueNumberOpt = (g: Graph) => misOpt(complement(g).freeze());
