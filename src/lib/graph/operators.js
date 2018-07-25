import {map} from "../iter";
import Graph from "./graph";

export const copy = graph => {
    const g2 = new Graph(graph.V);
    for (let i = 0; i < graph.V; i++) {
        g2.adj[i].push(...graph.adj[i]);
    }
    return g2;
}


export const addEdges = (graph, ...edges) => {
    for (const [x, y] of edges) {
        graph.addEdge(x, y);
    }
    return graph;
}

export const addPath = (graph, ...path) => {
    for (let i = 0; i < path.length - 1; i++) {
        graph.addEdge(path[i], path[i + 1]);
    }
    return graph;
}

export const addCycle = (graph, ...cycle) => {
    addPath(graph, ...cycle);
    graph.addEdge(cycle[0], cycle[cycle.length - 1]);
    return graph;
}

export function addClique(graph, ...clique) {
    for (let i = 0; i < clique.length - 1; i++) {
        for (let j = i + 1; j < clique.length; j++) {
            graph.addEdge(clique[i], clique[j]);
        }
    }
    return graph;
}

export const complement = graph => {
    const g2 = new Graph(graph.V);
    for (let i = 0; i < graph.V - 1; i++) {
        for (let j = i + 1; j < graph.V; j++) {
            if (!graph.hasEdge(i, j)) {
                g2.addEdge(i, j);
            }
        }
    }
    return g2;
}

export const product = (g1, g2) => {
    const graph = new Graph(g1.V * g2.V);
    for (let i = 0; i < g1.V; i++) {
        for (let j = 0; j < g2.V; j++) {
            for (const ii of g1.adj[i]) {
                graph.addEdge(i * g2.V + j, ii * g2.V + j);
            }
            for (const jj of g2.adj[j]) {
                graph.addEdge(i * g2.V + j, i * g2.V + jj);
            }
        }
    }
    return graph;
}

export const inducedGraph = (graph, set) => {
    const g2 = new Graph(set.length);
    const reverse = new Map();

    for (let i = 0; i < set.length; i++) {
        reverse.set(set[i], i);
    }

    for (let i = 0; i < set.length; i++) {
        for (const nbor of graph.adj[set[i]]) {
            if (reverse.has(nbor)) {  // a verifier
                g2.addEdge(i, reverse.get(nbor));
            }
        }
    }
    return g2;
}

export const union = (g1, g2) => {
    const graph = new Graph(g1.V + g2.V);

    for (let u = 0; u < g1.V; u++) {
        for (const v of g1.adj[u]) {
            graph.adj[u].push(v);
        }
    }

    for (let u = 0; u < g2.V; u++) {
        for (const v of g2.adj[u]) {
            graph.adj[g1.V + u].push(g1.V + v);
        }
    }

    return graph;
}

export const join = (g1, g2) => complement(union(complement(g1), complement(g2)));

export const lineGraph = graph => {
    const edges = [...graph.edges()];
    const m = new Map();
    const g2 = new Graph(edges.length);
    for (let i = 0; i < edges.length; i++) {
        const [u, v] = edges[i];
        m.set(graph.edgeId(u, v), i);
    }
    for (let i = 0; i < graph.V; i++) {
        const clique = map(graph.adj[i], j => m.get(graph.edgeId(i, j)));
        addClique(g2, ...clique);
    }
    return g2;
}
