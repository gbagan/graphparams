import * as iter from "../iter";
import {alternativePath} from "./basic";
import Graph from "./graph";
import lexbfs from "./lexbfs";
import {inducedGraph} from "./operators";
import { Result } from "./types";

function hasClique(g: Graph, set: number[]): Result {
    for (let i = 0; i < set.length - 1; i++) {
        for (let j = i + 1; j < set.length; j++) {
            if (!g.hasEdge(set[i], set[j])) {
                return { result: false, witness: [set[i], set[j]] };
            }
        }
    }
    return { result: true, witness: null };
}

export default function isChordal(g: Graph): Result {
    const lbfs = [...lexbfs(g, 0)];
    const visited = new Set<number>();
    let chordal = true;
    let witness: number[] = [];
    for (const v of lbfs) {
        const nbor = [...iter.filter(g.adj(v), u => visited.has(u))];
        const res = hasClique(g, nbor);
        if (!res.result) {
            chordal = false;
            witness = [v, res.witness![0], res.witness![1]];
            break;
        }
        visited.add(v);
    }
    if (chordal) {
        return { result: true, witness: lbfs };
    }
    const i = lbfs.indexOf(witness[0]);
    const g2 = inducedGraph(g, lbfs.slice(0, i)).freeze();
    const path = alternativePath(g2, lbfs.indexOf(witness[1]), lbfs.indexOf(witness[2])).witness!;
    return {
        result: false,
        witness: path.map(j => lbfs[j]).concat(witness[0]),
    };
}
