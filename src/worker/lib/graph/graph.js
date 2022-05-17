import {times} from '../fp';
import {insert} from '../sorted';

export const graph = nbVertices => times(() => [], nbVertices);

export const edges = graph => {
    const es = [];
    for (let i = 0; i < graph.length; i++) {
        for (const j of graph[i]) {
            if (i < j) {
                es.push([i, j]);
            }
        }
    }
    return es;
};

export const hasEdge = (graph, v, w) => graph[v].includes(w);
export const edgeId = (graph, x, y) => x < y ? x * graph.length + y : y * graph.length + x;

export const addEdge = (graph, v, w) => {
    graph[v] = insert(w, graph[v]);
    graph[w] = insert(v, graph[w]);
};

export const copy = g => g.map(adj => adj.slice());

export const clean = x => x;
//map(adj => uniq(sortBy(x => x, adj)));
