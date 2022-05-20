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
                return {result: false, certificate: [set[i], set[j]]}
            }
        }
    }
    return { result: true, certificate: null }
}

const isChordal = graph => {
    const lbfs = lexbfs(graph, 0)
    const visited = new Set()
    let chordal = true
    let certificate = []
    for (const v of lbfs) {
        const nbor = graph[v].filter(u => visited.has(u))
        const res = hasClique(graph, nbor)
        if (!res.result) {
            chordal = false
            certificate = [v, res.certificate[0], res.certificate[1]]
            break
        }
        visited.add(v)
    }
    if (chordal) {
        return { result: true, ctype: "order", certificate: lbfs };
    }
    const ss = difference(range(0, graph.length), graph[certificate[0]])
                .filter(i => i != certificate[0])
                .concat([certificate[1], certificate[2]])
                .sort((a, b) => a - b)
    const g2 = inducedGraph(graph, ss)
    const path = alternativePath(g2, ss.indexOf(certificate[1]), ss.indexOf(certificate[2])).certificate;
    return {
        result: false,
        ctype: "path",
        certificate: [certificate[0]].concat(path.map(j => ss[j])).concat(certificate[0]),
    }
}

export default isChordal