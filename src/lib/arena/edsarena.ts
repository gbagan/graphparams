import Graph from "../graph/graph";
import {Result} from "../graph/types";
import {filter, permutations, zip} from "../iter";
import {sublists} from "../util";
import Arena from "./arena";
import makeRules from "./rules";
import {Answer, Conf, Shift} from "./types";

export default class EDSArena extends Arena<Conf> {
    constructor(public n: number, public k: number) {
        super();
    }

    public guardsWin(): Result {
        if (!this.attractor) {
            return { result: false, witness: null };
        }

        for (const conf of this.AConfs()) {
            if (!this.attractor.has(conf.toString())) {
                return { result: true, witness: conf };
            }
        }
        return { result: false, witness: null };
    }

    public guardsAnswer(graph: Graph, guards: Conf, attack: number): Answer | null {
        const answer = this.answer(guards.concat(attack));
        if (!answer) {
            return null;
        }
        let nicePerm: Conf | null = null;
        for (const permGuards of permutations(guards)) {
            if (permGuards.every((guard, i) =>
                guard === answer[i] || graph.hasEdge(guard, answer[i]))) {
                nicePerm = permGuards;
                break;
            }
        }
        if (!nicePerm) {
            return null;
        }
        const shift: Shift = [...filter(zip(nicePerm, answer), (pair) => pair[0] !== pair[1])];

        return {conf: answer, shift};
    }

    public AConfs() {
        return sublists(this.n, this.k);
    }

    public * BConfs() {
        for (const conf of sublists(this.n, this.k)) {
            for (let i = 0; i < this.n; i++) {
                if (!conf.includes(i)) {
                    yield conf.concat(i);
                }
            }
        }
    }

    protected isAConf(conf: Conf) {
        return conf.length === this.k;
    }
}

export function makeArena(graph: Graph, k: number, rulesName: "one" | "all") {
    const arena = new EDSArena(graph.V, k);
    const rules = makeRules(rulesName);
    if (!rules) {
        return null;
    }
    for (const conf of arena.AConfs()) {
        arena.adj.set(conf.toString(), []);
        arena.reverseAdj.set(conf.toString(), []);
    }

    for (const conf of arena.BConfs()) {
        arena.adj.set(conf.toString(), []);
        arena.reverseAdj.set(conf.toString(), []);
    }

    for (const conf of arena.AConfs()) {
        for (const conf2 of rules.attackerPossibilities(graph, conf)) {
            arena.addEdge(conf, conf2);
        }

        for (let attack = 0; attack < graph.V; attack++) {
            if (!conf.includes(attack)) {
                const conf2 = conf.concat(attack);
                for (const conf3 of rules.guardsPossibilities(graph, conf2)) {
                    arena.addEdge(conf2, conf3);
                }
            }
        }
    }
    arena.computeAttractor();
    return arena;
}
