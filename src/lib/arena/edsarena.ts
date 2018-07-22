import {maxBy, sortBy, zipWith} from 'ramda';

import {EDSGraph, Guards} from "./types";

import Graph from "../graph/graph";
import {Result} from "../graph/types";
import {permutations, sublists} from "../util";
import {answer, makeArenaGraph} from "./arena";
import makeRules from "./rules";

export {startingConf} from "./arena";

export function guardsWin(edsgraph: EDSGraph): Result {
    for (const conf of edsgraph.AConfs()) {
        if (!edsgraph.attractor.has(conf.toString())) {
            return { result: true, witness: conf };
        }
    }
    return { result: false, witness: null };
}

export function guardsAnswer(edsgraph: EDSGraph, guards: Guards, attack: number): Guards | null {
    const ans = answer(edsgraph, sortBy(x => x, guards).concat(attack));
    if (!ans) {
        return null;
    }

    const perms =  [...permutations(ans)];
    const shifts = perms.map(perm =>
        zipWith((from, to) => ({from, to}), guards, perm)
    ).filter(shift =>
        shift.every(p => p.from === p.to || edsgraph.graph.hasEdge(p.from, p.to))
    ).map(shift => ({shift, score: shift.map(p => p.from === p.to).length}));

    const bestShift = shifts.reduce(maxBy(shift => shift.score), shifts[0]); 
    return bestShift.shift.map(x => x.to);
}

export function makeEDS (graph: Graph, k: number, rulesName: 'one' | 'all'): EDSGraph {
    const rules = makeRules(rulesName);
    const arena = {
        AConfs: () => sublists(graph.V, k),
        BConfs: function * () {
            for (const conf of sublists(graph.V, k)) {
                for (let i = 0; i < graph.V; i++) {
                    if (!conf.includes(i)) {
                        yield conf.concat(i);
                    }
                }
            }
        },
        isAConf: (conf: number[]) => conf.length === k,
        neighbors: (conf: number[]) => conf.length === k
                                     ? rules.attackerPossibilities(graph, conf)
                                     : rules.guardsPossibilities(graph, conf)
    };

    const arenaGraph = makeArenaGraph(arena);
    return { graph, ...arenaGraph };
}
