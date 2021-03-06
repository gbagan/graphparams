import {edges} from '@/lib/graph/graph';
import {times} from '@fp';
import {createSelector} from '@/commonreact';

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

const edge = (x, y) => x < y ? { from: x, to: y } : { from: y, to: x };

const selectedEdges = witness => {
    if (!witness)
        return [];
    else if (witness.name === 'matching')
        return witness.witness.map(x => ({from: x[0], to: x[1]}));
    else if (witness.name === 'diameter')
        return times(
            i => edge(witness.witness[i], witness.witness[i + 1]),
            witness.witness.length - 1
        );
    else if (witness.name === 'hamilton' || witness.name === 'girth' || witness.name === 'chordal')
        return times(
            i => edge(witness.witness[i], witness.witness[i === witness.witness.length - 1 ? 0 : i + 1]),
            witness.witness.length
        );
    else
        return [];
}

const getGraphInfos = createSelector(
    state => state.graph,
    state => state.witness,
    (graph, witness) => ({
        nodeColors: graph && times(i => nodeColor(witness, i), graph.length),
        edges: graph && edges(graph),
        selectedEdges: selectedEdges(witness)
    })
);

export default state => ({ ...state, ...getGraphInfos(state) });