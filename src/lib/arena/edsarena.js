import {all, countBy, filter, minBy, sortBy} from '@fp';
import {hasEdge} from '../graph/graph';

import {permutations, sublists} from '../util';
import {answer, makeArenaGraph} from './arena';
import makeRules from './rules';

export {startingConf} from './arena';

export const guardsAnswer = (edsgraph, guards, attack) => {
    const ans = answer(edsgraph, sortBy(x => x, guards).concat(attack));
    if (!ans) {
        return null;
    }

    const perms =  [...permutations(ans)];
    return perms
        |> filter(all((guard, i) => guard === guards[i] || hasEdge(edsgraph.graph, guard, guards[i])))
        |> minBy(countBy((guard, i) => guard !== guards[i]))
};

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
};
