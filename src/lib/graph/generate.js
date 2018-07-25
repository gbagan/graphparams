import  {range} from '@fp';
import Graph from './graph';
import {join, product, addPath, addCycle, addClique} from "./operators";

export const graph = n => new Graph(n);
export const path = n => addPath(graph(n), ...range(0, n));
export const cycle = n => addCycle(graph(n), ...range(0, n));
export const clique = n => addClique(graph(n), ...range(0, n));
export const biclique = (n, m) => join(graph(n), graph(m));
export const grid = (n, m) => product(path(n), path(m));
export const star = n => biclique(1, n);

export const petersen = () => {
    const g = graph(10);

    for (let i = 0; i < 5; i++) {
        g.addEdge(i, (i + 1) % 5);
        g.addEdge(i + 5, (i + 2) % 5 + 5);
        g.addEdge(i, i + 5);
    }

    return g;
}

export const hajos = n => {
    const g = graph(2 * n);
    for (let i = 0; i < n; i++) {
        addClique(g, i, i + n, (i + 1) % n);
    }
    return g;
}

export const sun = n => {
    const g = graph(2 * n);
    addClique(g, ...range(0, n));
    for (let i = 0; i < n; i++) {
        addPath(g, i, i + n, (i + 1) % n);
    }
    return g;
}
