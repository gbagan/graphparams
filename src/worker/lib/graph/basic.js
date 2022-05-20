import {minimum, maximum, maxBy, sum, range} from '../fp'
import {decode, encode} from '../binary'
import {edges, hasEdge} from './graph'
import {complement} from './operators'

export const nbVertices = graph => graph.length
export const nbEdges = graph => graph.flat().length / 2

export const minDegree = graph => minimum(graph.map(nbor => nbor.length))
export const maxDegree = graph => maximum(graph.map(nbor => nbor.length))

export const isRegular = g  => {
    const n = g.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j  < n; j++) {
            if (g[i].length != g[j].length) {
                return { result: false, wtype: "set", witness: [i, j] }
            }
        }
    }
    return { result: true, wtype: "nowitness", witness: [] }
}

export const isConnected = graph => {
    const visited = new Array(graph.lenth)
    visited.fill(false)
    const stack = []
    let nbVisited = 1
    visited[0] = true
    stack.push(0)
    while (stack.length > 0) {
        const u = stack.pop()
        for (const w of graph[u]) {
            if (!visited[w]) {
                stack.push(w)
                visited[w] = true
                nbVisited++
            }
        }
    }
    return nbVisited === graph.length
};

export const isHamiltonian = graph => {
    if (graph.length === 1) 
        return { result: true, wtype: "path", witness: [0] }
    if (graph.length === 2)
        return { result: false, wtype: "nowitness", witness: [] }
    const res = hamiltonAux(graph, [0])
    return res ? { result: true, wtype: "path", witness: res.concat(res[0]) } : { result: false, wtype: "nowitness", witness: [] }
}

const hamiltonAux = (graph, path) => {
    const last = path[path.length - 1]
    if (path.length === graph.length) {
        return hasEdge(graph, path[0], last) ? path : null
    } else {
        for (const v of graph[last]) {
            if (path.includes(v)) {
                continue
            }
            const res = hamiltonAux(graph, path.concat(v));
            if (res) {
                return res
            }
        }
        return null
    }
}

export const degeneracy = graph => {
    const set = new Set(range(0, graph.length))
    const order = []
    let maxdegree = 0
    while (set.size > 0) {
        let minDeg = Infinity
        let bestVertex = null
        for (const v of set) {
            const degree = sum(graph[v].map(u => set.has(u) ? 1: 0))
            if (degree < minDeg) {
                bestVertex = v
                minDeg = degree
            }
        }
        set.delete(bestVertex)
        order.push(bestVertex)
        maxdegree = Math.max(maxdegree, minDeg)
    }

    return { result: maxdegree, wtype: "order", witness: order }
}

export const eccentricity = (graph, vertex) => {
    const distance = new Array(graph.length)
    distance.fill(-1)
    const parent = new Array(graph.length)
    parent.fill(-1)
    const queue = []
    let nbVisited = 1
    distance[vertex] = 0
    queue.push(vertex)
    while (queue.length > 0) {
        const u = queue.shift()
        for (const w of graph[u]) {
            if (distance[w] === -1) {
                queue.push(w)
                distance[w] = distance[u] + 1
                parent[w] = u
                nbVisited++
            }
        }
    }

    if (nbVisited !== graph.length) {
        return { result: -1, wtype: "nowitness", witness: [] }
    } else {
        let u = maxBy(range(0, graph.length), w => distance[w]);
        const path = [u]
        while (u !== vertex) {
            u = parent[u]
            path.push(u)
        }

        return { result: path.length - 1, wtype: "path", witness: path.reverse() }
    }
}

export const alternativePath = (graph, v1, v2) => {
    const distance = new Array(graph.length)
    const parent = new Array(graph.length)
    const queue = []
    parent.fill(-1)
    distance.fill(-1)
    distance[v1] = 0
    queue.push(v1)
    while (queue.length > 0) {
        const u = queue.shift()
        for (const w of graph[u]) {
            if (u === v1 && w === v2) {
                continue
            }
            if (distance[w] === -1) {
                queue.push(w)
                distance[w] = distance[u] + 1;
                parent[w] = u
            }
        }
    }

    if (distance[v2] === -1) {
        return { result: Infinity, witness: null };
    } else {
        const path = [v2];
        let u = v2
        while (u !== v1) {
            u = parent[u]
            path.push(u)
        }

        return { result: path.length - 1, wtype: "path", witness: path }
    }
};

export const girth = graph => {
    let bestRes = { result: Infinity, witness: null }
    for (const [u, v] of edges(graph)) {
        const res = alternativePath(graph, u, v)
        if (res.result !== Infinity && res.result + 1 < bestRes.result) {
            bestRes = { result: res.result + 1,  wtype: "path", witness: res.witness.concat(res.witness[0]) }
        }
    }
    return bestRes
};

export const diameter = graph => {
    let bestRes = { result: -1 }
    for (let i = 0; i < graph.length; i++) {
        const res = eccentricity(graph, i)
        if (res.result > bestRes.result) {
            bestRes = res
        }
    }
    return bestRes
}

export const mis = graph => {
    let isets = [0]
    let i = 0
    const nbors = graph.map(adj => encode(adj))

    while (true) {
        const isets2 = []

        for (const iset of isets) {
            const begin = (i === 0) ? 0 : (32 - Math.clz32(iset))
            for (let ii = begin; ii < graph.length; ii++) {
                if ((iset & nbors[ii]) === 0) {
                    isets2.push(iset | (1 << ii))
                }
            }
        }
        if (isets2.length === 0) {
            return { result: i, wtype: "set", witness: decode(isets[0]) }
        }
        isets = isets2
        i++
    }
};

// const cliqueNumberNonOpt = (g: Graph) => mis(complement(g).freeze());
export const cliqueNumber = graph => mis(complement(graph))
