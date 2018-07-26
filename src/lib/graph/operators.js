import {curry2, forEach, map, updateArray, times} from '@fp';
import {addEdge, copy, edgeId, edges, graph, hasEdge, updateGraph} from './graph';

export const addEdges = curry2((edges, graph) =>
    graph |> updateGraph(addEdge =>
        edges |> forEach(([x, y]) => addEdge(x, y))
    )
);

export const addPath = curry2((path, graph) =>
    graph |> updateGraph(addEdge => {
        for (let i = 0; i < path.length - 1; i++)
            addEdge(path[i], path[i + 1]);
    })
);

export const addCycle = curry2((cycle, graph) => {
    const g2 = addPath(cycle, graph);
    addEdge(g2, cycle[0], cycle[cycle.length - 1]);
    return g2;
});

export const _addClique = (graph, clique) => {
    for (let i = 0; i < clique.length - 1; i++) {
        for (let j = i + 1; j < clique.length; j++) {
            addEdge(graph, clique[i], clique[j]);
        }
    }
};

export const addClique = curry2((clique, graph) => {
    const g2 = copy(graph);
    _addClique(g2, clique);
    return g2;
});

export const complement = g =>
    graph(g.length) |> updateGraph(addEdge => {
        for (let i = 0; i < g.length - 1; i++) {
            for (let j = i + 1; j < g.length; j++) {
                if (!hasEdge(g, i, j)) {
                    addEdge(i, j);
                }
            }
        }
    });


export const product = (g1, g2) =>
    graph(g1.length * g2.length) |> updateGraph(addEdge => {
        for (let i = 0; i < g1.length; i++) {
            for (let j = 0; j < g2.length; j++) {
                for (const ii of g1[i]) {
                    addEdge(i * g2.length + j, ii * g2.length + j);
                }
                for (const jj of g2[j]) {
                    addEdge(i * g2.length + j, i * g2.length + jj);
                }
            }
        }
    });

export const inducedGraph = curry2((subset, g) => {
    const reverse = times(() => -1, g.length) |> updateArray(set => forEach(set, subset));
    return graph(subset.length) |> updateGraph(addEdge =>
        subset |> forEach((v, i) =>
            g[v] |> forEach(u => reverse[u] !== -1 && addEdge(i, reverse[u]))
        )
    );
});
 
export const union = (g1, g2) =>
    graph(g1.length + g2.length) |> updateGraph(addEdge => {
        edges(g1) |> forEach(([u, v]) => addEdge(u, v));
        edges(g2) |> forEach(([u, v]) => addEdge(u + g1.length, v + g1.length));
    });

export const join = (g1, g2) => complement(union(complement(g1), complement(g2)));

export const lineGraph = g => {
    const es = edges(g);
    const m = new Map();
    const g2 = graph(es.length);
    for (let i = 0; i < es.length; i++) {
        const [u, v] = es[i];
        m.set(edgeId(g, u, v), i);
    }
    for (let i = 0; i < g.length; i++) {
        const clique = g[i] |> map(j => m.get(edgeId(g, i, j)));
        _addClique(g2, clique);
    }
    return g2;
};
