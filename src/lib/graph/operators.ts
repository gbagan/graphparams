import {map} from "../iter";
import Graph from "./graph";

export function copy(g: Graph) {
    const g2 = new Graph(g.V);
    for (let i = 0; i < g.V; i++) {
        g2.adj[i].push(...g.adj[i]);
    }
    return g2;
}


export function addEdges(g: Graph, ...edges: number[][]) {
    for (const [x, y] of edges) {
        g.addEdge(x, y);
    }
    return g;
}

export function addPath(g: Graph, ...path: number[]) {
    for (let i = 0; i < path.length - 1; i++) {
        g.addEdge(path[i], path[i + 1]);
    }
    return g;
}

export function addCycle(g: Graph, ...cycle: number[]) {
    addPath(g, ...cycle);
    g.addEdge(cycle[0], cycle[cycle.length - 1]);
    return g;
}

export function addClique(g: Graph, ...clique: number[]) {
    for (let i = 0; i < clique.length - 1; i++) {
        for (let j = i + 1; j < clique.length; j++) {
            g.addEdge(clique[i], clique[j]);
        }
    }
    return g;
}

export function complement(g: Graph) {
    const g2 = new Graph(g.V);
    for (let i = 0; i < g.V - 1; i++) {
        for (let j = i + 1; j < g.V; j++) {
            if (!g.hasEdge(i, j)) {
                g2.addEdge(i, j);
            }
        }
    }
    return g2;
}

export function product(g1: Graph, g2: Graph) {
    const g = new Graph(g1.V * g2.V);
    for (let i = 0; i < g1.V; i++) {
        for (let j = 0; j < g2.V; j++) {
            for (const ii of g1.adj[i]) {
                g.addEdge(i * g2.V + j, ii * g2.V + j);
            }
            for (const jj of g2.adj[j]) {
                g.addEdge(i * g2.V + j, i * g2.V + jj);
            }
        }
    }
    return g;
}

export function inducedGraph(g: Graph, set: ReadonlyArray<number>) {
    const g2 = new Graph(set.length);
    const reverse = new Map<number, number>();

    for (let i = 0; i < set.length; i++) {
        reverse.set(set[i], i);
    }

    for (let i = 0; i < set.length; i++) {
        for (const nbor of g.adj[set[i]]) {
            if (reverse.has(nbor)) {  // a verifier
                g2.addEdge(i, reverse.get(nbor)!);
            }
        }
    }
    return g2;
}

export function union(g1: Graph, g2: Graph) {
    const g = new Graph(g1.V + g2.V);

    for (let u = 0; u < g1.V; u++) {
        for (const v of g1.adj[u]) {
            g.adj[u].push(v);
        }
    }

    for (let u = 0; u < g2.V; u++) {
        for (const v of g2.adj[u]) {
            g.adj[g1.V + u].push(g1.V + v);
        }
    }

    return g;
}

export function join(g1: Graph, g2: Graph) {
    return complement(union(complement(g1), complement(g2)));
}

export function lineGraph(g: Graph) {
    const edges = [...g.edges()];
    const m = new Map<number, number>();
    const g2 = new Graph(edges.length);
    for (let i = 0; i < edges.length; i++) {
        const [u, v] = edges[i];
        m.set(g.edgeId(u, v), i);
    }
    for (let i = 0; i < g.V; i++) {
        const clique = map<number, number>(g.adj[i], j =>
            m.get(g.edgeId(i, j))!);
        addClique(g2, ...clique);
    }
    return g2;
}
