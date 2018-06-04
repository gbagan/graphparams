import {range} from "../iter";
import MutableGraph from "./mutablegraph";
import {join, product} from "./operators";

export const graph = (n: number) => new MutableGraph(n);
export const path = (n: number) => new MutableGraph(n).addPath(...range(n));
export const cycle = (n: number) => new MutableGraph(n).addCycle(...range(n));
export const clique = (n: number) => new MutableGraph(n).addClique(...range(n));
export const biclique = (n: number, m: number) => join(graph(n), graph(m));
export const grid = (n: number, m: number) => product(path(n), path(m));
export const star = (n: number) => biclique(1, n);

export function petersen() {
    const g = new MutableGraph(10);

    for (let i = 0; i < 5; i++) {
        g.addEdge(i, (i + 1) % 5);
        g.addEdge(i + 5, (i + 2) % 5 + 5);
        g.addEdge(i, i + 5);
    }

    return g;
}

export function hajos(n: number) {
    const g = new MutableGraph(2 * n);
    for (let i = 0; i < n; i++) {
        g.addClique(i, i + n, (i + 1) % n);
    }
    return g;
}

export function sun(n: number) {
    const g = new MutableGraph(2 * n);
    g.addClique(...range(n));
    for (let i = 0; i < n; i++) {
        g.addPath(i, i + n, (i + 1) % n);
    }
    return g;
}
