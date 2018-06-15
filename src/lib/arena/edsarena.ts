import * as R from "ramda";

import {EDSGraph, Answer, Guards, Shift} from "./types";

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

export function guardsAnswer(edsgraph: EDSGraph, guards: Guards, attack: number): Answer | null {
    const ans = answer(edsgraph, guards.concat(attack));
    if (!ans) {
        return null;
    }

    const perms =  [...permutations(guards)];
    const shifts = perms.map(perm =>
        R.zipWith((from, to) => ({from, to}), perm, ans).filter(({from, to}) => from !== to)
    ).filter(shift =>
        shift.every(({from, to}) => edsgraph.graph.hasEdge(from, to))
    );
    
    if (shifts.length === 0)
        return null;

    const bestShift = R.reduce(R.minBy<Shift>(shift => shift.length), shifts[0], shifts ); 
    return {conf: ans, shift: bestShift};
}

export function makeEDS (graph: Graph, k: number, rulesName: "one" | "all"): EDSGraph {
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
