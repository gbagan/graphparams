import {addEdge, graph, hasEdge} from './graph';

export const complement = g => {
    const g2 = graph(g.length)

    for (let i = 0; i < g.length - 1; i++) {
        for (let j = i + 1; j < g.length; j++) {
            if (!hasEdge(g, i, j)) {
                addEdge(g2, i, j)
            }
        }
    }
    return g2
}

export const inducedGraph = (g, subset) => {
    const reverse = new Array(g.length)
    reverse.fill(-1)
    for(let i = 0; i < subset.length; i++) {
        reverse[subset[i]] = i
    }
    const g2 = graph(subset.length)
    for(let i = 0; i < subset.length; i++) {
        for(u of g[subset[i]]) {
            if (reverse[u] !== -1) {
                addEdge(g2, i, reverse[u])
            }
        }
    }
    return g2
}
