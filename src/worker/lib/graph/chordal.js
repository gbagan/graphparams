import {hasEdge} from './graph';
import {alternativePath} from './basic';
import lexbfs from './lexbfs';
import {inducedGraph} from './operators';
import { range } from '../fp';
import {difference} from '../sorted'

const hasClique = (graph, set) => {
    for (let i = 0; i < set.length - 1; i++) {
        for (let j = i + 1; j < set.length; j++) {
            if (!hasEdge(graph, set[i], set[j])) {
                return {result: false, witness: [set[i], set[j]]};
            }
        }
    }
    return { result: true, witness: null };
};

const isChordal = graph => {
    const lbfs = lexbfs(graph, 0)
    const visited = new Set()
    let chordal = true
    let witness = []
    for (const v of lbfs) {
        const nbor = graph[v].filter(u => visited.has(u))
        const res = hasClique(graph, nbor)
        if (!res.result) {
            chordal = false
            witness = [v, res.witness[0], res.witness[1]]
            break
        }
        visited.add(v);
    }
    if (chordal) {
        return { result: true, wtype: "order", witness: lbfs };
    }
    const ss = difference(range(0, graph.length), graph[witness[0]])
                .filter(i => i != witness[0])
                .concat([witness[1], witness[2]])
                .sort((a, b) => a - b)
    const g2 = inducedGraph(graph, ss)
    const path = alternativePath(g2, ss.indexOf(witness[1]), ss.indexOf(witness[2])).witness;
    return {
        result: false,
        wtype: "path",
        witness: [witness[0]].concat(path.map(j => ss[j])).concat(witness[0]),
    };
};

export default isChordal;