import {chain, range} from '@fp';
import {graph, updateGraph} from './graph';
import { join, product, addPath, addCycle, addClique } from './operators';

export const path = n => addPath(range(0, n), graph(n));
export const cycle = n => addCycle(range(0, n), graph(n));
export const clique = n => addClique(range(0, n), graph(n));
export const biclique = (n, m) => join(graph(n), graph(m));
export const grid = (n, m) => product(path(n), path(m));
export const star = n => biclique(1, n);

export const petersen = () =>
    graph(10) |> updateGraph(addEdge => {
        for (let i = 0; i < 5; i++) {
            addEdge(i, (i + 1) % 5);
            addEdge(i + 5, (i + 2) % 5 + 5);
            addEdge(i, i + 5);
        }
    });

export const sun = n =>
    graph(2 * n)
        |> addClique(range(0, n))
        |> addCycle(chain(i => [i, i+n], range(0, n)));
