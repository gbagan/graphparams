import {Arena, ArenaGraph} from "./types";

import { Map_dec } from "../util";

export function makeArenaGraph<T>(arena: Arena<T>): ArenaGraph<T> {
    const adj = new Map<string, T[]>();
    const reverseAdj = new Map<string, T[]>();
    
    const confs = [...arena.AConfs(), ...arena.BConfs()];

    for (const conf of confs) {
        adj.set(conf.toString(), []);
        reverseAdj.set(conf.toString(), []);
    }

    for (const conf of confs) {
        for (const conf2 of arena.neighbors(conf)) {
            adj.get(conf.toString())!.push(conf2);
            reverseAdj.get(conf2.toString())!.push(conf);
        }
    }
    const attractor = computeAttractor(arena, adj, reverseAdj);
    return { adj, reverseAdj, attractor, ...arena };
}

function computeAttractor<T>(arena: Arena<T>, adj: Map<string, T[]>, reverseAdj: Map<string, T[]>) {
    const attractor = new Set<string>();

    const deg = new Map<string, number>();
    const stack = new Array<T>();

    for (const conf of arena.BConfs()) {
        const nbor = adj.get(conf.toString())!;
        deg.set(conf.toString(), nbor.length);
        if (nbor.length === 0) { // final winning configurations for the attacker
            stack.push(conf);
            attractor.add(conf.toString());
        }
    }

    while (stack.length > 0) {
        const elem = stack.pop()!;

        for (const pred of reverseAdj.get(elem.toString())!) {
            const rpred = pred.toString();
            if (!attractor.has(rpred) &&  (arena.isAConf(pred) || Map_dec(deg, pred) === 0)) {
                attractor.add(rpred);
                stack.push(pred);
            }
        }
    }
    return attractor;
}



export function startingConf<T>(arenaGraph: ArenaGraph<T>) {
    for (const conf of arenaGraph.AConfs()) {
        if (!arenaGraph.attractor.has(conf.toString())) {
            return conf;
        }
    }
    return null;
}

export function answer<T>(arenaGraph: ArenaGraph<T>, conf: T) {
    for (const conf2 of arenaGraph.adj.get(conf.toString())!) {
        if (!arenaGraph.attractor.has(conf2.toString())) {
            return conf2;
        }
    }
    return null;
}
