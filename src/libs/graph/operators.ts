import {map} from "../iter";
import MutableGraph from "./mutablegraph";
import { GenericGraph as Graph } from "./types";

export function copy(g: Graph) {
    const g2 = new MutableGraph(g.V);
    for (let i = 0; i < g.V; i++) {
        g2.adj(i).push(...g.adj(i));
    }
    return g2;
}

export function complement(g: Graph) {
    const g2 = new MutableGraph(g.V);
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
    const g = new MutableGraph(g1.V * g2.V);
    for (let i = 0; i < g1.V; i++) {
        for (let j = 0; j < g.V; j++) {
            for (const ii of g1.adj(i)) {
                g.addEdge(i * g.V + j, ii * g.V + j);
            }
            for (const jj of g2.adj(j)) {
                g.addEdge(i * g.V + j, i * g.V + jj);
            }
        }
    }
    return g2;
}

export function inducedGraph(g: Graph, set: ReadonlyArray<number>) {
    const g2 = new MutableGraph(set.length);
    const reverse = new Map<number, number>();

    for (let i = 0; i < set.length; i++) {
        reverse.set(set[i], i);
    }

    for (let i = 0; i < set.length; i++) {
        for (const nbor of g.adj(set[i])) {
            if (reverse.has(nbor)) {  // a verifier
                g2.addEdge(i, reverse.get(nbor)!);
            }
        }
    }
    return g2;
}

export function union(g1: Graph, g2: Graph) {
    const g = new MutableGraph(g1.V + g2.V);

    for (let u = 0; u < g1.V; u++) {
        for (const v of g1.adj(u)) {
            g.adj(u).push(v);
        }
    }

    for (let u = 0; u < g2.V; u++) {
        for (const v of g2.adj(u)) {
            g.adj(g1.V + u).push(g1.V + v);
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
    const g2 = new MutableGraph(edges.length);
    for (let i = 0; i < edges.length; i++) {
        const [u, v] = edges[i];
        m.set(g.edgeId(u, v), i);
    }
    for (let i = 0; i < g.V; i++) {
        const clique = map<number, number>(g.adj(i), j =>
            m.get(g.edgeId(i, j))!);
        g2.addClique(...clique);
    }
    return g2;
}
