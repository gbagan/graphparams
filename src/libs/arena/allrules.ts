import Graph from "../graph/graph";
import {allDifferent} from "../graph/util";
import OneRules from "./onerules";

export default class AllRules extends OneRules {
    public * guardsPossibilities(g: Graph, conf: number[]): Iterable<number[]> {
        const gconf = Array.from(conf);
        const attack = gconf.pop()!;
        for (const conf2 of this.multiMoves(g, gconf, 0)) {
            const conf3 = conf2.slice();
            conf3.sort((a, b) => a - b);
            if (allDifferent(conf3) && conf3.includes(attack)) {
                yield conf3;
            }
        }
    }

    public * multiMoves(g: Graph, conf: number[], i: number): Iterable<number[]> {
        if (i === conf.length) {
            yield conf;
        } else {
            for (const conf2 of this.multiMoves(g, conf, i + 1)) {
                yield conf2;
                for (const nbor of g.adj(conf2[i])) {
                    const conf3 = Array.from(conf2);
                    conf3[i] = nbor;
                    yield conf3;
                }
            }
        }
    }
}
