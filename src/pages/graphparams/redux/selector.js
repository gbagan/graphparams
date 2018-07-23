import { map, filter, range, times } from '@fp';
import { createSelector } from '@/commonreact';

const nodeColor = (witness, i) => {
    if (!witness)
        return 0;
    else if (['chromatic', 'domcol', 'totaldomcol', 'domedcol'].includes(witness.name))
        return witness.witness[i];
    else if (witness.witness.includes(i))
        return 1;
    else
        return 0;
};

const updateArray = (t, fn) => {
    const t1 = t; // shallow copy;
    fn((i, val) => t1[i] = val, val => t1.push(val));
    return t1;
}

const forEach = (t, fn) => t.forEach(fn);

const edges = graph =>
    updateArray([], (set, push) =>
        forEach(graph.adj, (adj, i) =>
            forEach(adj, j =>
                i < j && push({ from: i, to: j }),
            ),
        ),
    );

const edge = (x, y) => x < y ? { from: x, to: y } : { from: y, to: x };

const selectedEdges = witness => {
    if (!witness)
        return [];
    else if (witness.name === 'matching')
        return times(
            i => edge(witness.witness[2 * i], witness.witness[2 * i + 1]),
            witness.witness.length / 2
        );
    else if (witness.name === 'diameter')
        return times(
            i => edge(witness.witness[i], witness.witness[i + 1]),
            witness.witness.length - 1
        );
    else if (witness.name === 'hamilton' || witness.name === 'girth' || witness.name === 'chordal')
        return times(
            i => edge(witness.witness[i], witness.witness[i === witness.witness.length - 1 ? 0 : i + 1]),
            witness.witness.length
        )
    else
        return [];
}

const getGraphInfos = createSelector(
    state => state.graph,
    state => state.witness,
    (graph, witness) => ({
        nodeColors: graph && times(i => nodeColor(witness, i), graph.V),
        edges: graph && edges(graph),
        selectedEdges: selectedEdges(witness)
    })
);

export default createSelector(state => state.graphparams, state => ({ ...state, ...getGraphInfos(state) }));