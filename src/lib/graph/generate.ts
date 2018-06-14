import * as R from "ramda";
import Graph from "./graph";
import {join, product, addPath, addCycle, addClique} from "./operators";

export const graph = (n: number) => new Graph(n);
export const path = (n: number) => addPath(graph(n), ...R.range(0, n));
export const cycle = (n: number) => addCycle(graph(n), ...R.range(0, n));
export const clique = (n: number) => addClique(graph(n), ...R.range(0, n));
export const biclique = (n: number, m: number) => join(graph(n), graph(m));
export const grid = (n: number, m: number) => product(path(n), path(m));
export const star = (n: number) => biclique(1, n);

export function petersen() {
    const g = graph(10);

    for (let i = 0; i < 5; i++) {
        g.addEdge(i, (i + 1) % 5);
        g.addEdge(i + 5, (i + 2) % 5 + 5);
        g.addEdge(i, i + 5);
    }

    return g;
}

export function hajos(n: number) {
    const g = graph(2 * n);
    for (let i = 0; i < n; i++) {
        addClique(g, i, i + n, (i + 1) % n);
    }
    return g;
}

export function sun(n: number) {
    const g = graph(2 * n);
    addClique(g, ...R.range(0, n));
    for (let i = 0; i < n; i++) {
        addPath(g, i, i + n, (i + 1) % n);
    }
    return g;
}
