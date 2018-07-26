import {maxBy, sortBy, zipWith} from '@fp';
import {hasEdge} from '../graph/graph';

import {permutations, sublists} from '../util';
import {answer, makeArenaGraph} from './arena';
import makeRules from './rules';

export {startingConf} from './arena';

export const guardsWin = edsgraph => {
    for (const conf of edsgraph.AConfs()) {
        if (!edsgraph.attractor.has(conf.toString())) {
            return { result: true, witness: conf };
        }
    }
    return { result: false, witness: null };
}

export const guardsAnswer = (edsgraph, guards, attack) => {
    const ans = answer(edsgraph, sortBy(x => x, guards).concat(attack));
    if (!ans) {
        return null;
    }

    const perms =  [...permutations(ans)];
    const shifts = perms.map(perm =>
        zipWith((from, to) => ({from, to}), guards, perm)
    ).filter(shift =>
        shift.every(p => p.from === p.to || hasEdge(edsgraph.graph, p.from, p.to))
    ).map(shift => ({shift, score: shift.map(p => p.from === p.to).length}));

    const bestShift = maxBy(shift => shift.score, shifts); 
    return bestShift.shift.map(x => x.to);
}

export const makeEDS = (graph, k, rulesName) => {
    const rules = makeRules(rulesName);
    const arena = {
        AConfs: () => sublists(graph.length, k),
        BConfs: function * () {
            for (const conf of sublists(graph.length, k)) {
                for (let i = 0; i < graph.length; i++) {
                    if (!conf.includes(i)) {
                        yield conf.concat(i);
                    }
                }
            }
        },
        isAConf: conf => conf.length === k,
        neighbors: conf => conf.length === k
                                     ? rules.attackerPossibilities(graph, conf)
                                     : rules.guardsPossibilities(graph, conf)
    };

    const arenaGraph = makeArenaGraph(arena);
    return { graph, ...arenaGraph };
}
