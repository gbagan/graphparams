import { sublists, Map_dec, allDifferent } from "./util";
import { GenericGraph, Result } from "./graph"

import {zip, filter, permutations} from '../iter';

type Conf = ReadonlyArray<number>
export type Shift = ReadonlyArray<Readonly<[number,number]>>;
interface Answer {
    readonly conf: Conf,
    readonly shift: Shift
}

abstract class Arena<T> {
    adj: Map<string, T[]>;
    reverse_adj: Map<string, T[]>;
    attractor: Set<string>|null;

    abstract AConfs(): Iterable<T>;
    abstract BConfs(): Iterable<T>;
    abstract isAConf(conf: T): boolean;

    constructor() {
        this.adj = new Map();
        this.reverse_adj = new Map();
        this.attractor = null;
    }

    addEdge(from: T, to: T) {
        this.adj.get(from.toString())!.push(to);
        this.reverse_adj.get(to.toString())!.push(from);
    }


    computeAttractor() {
        this.attractor = new Set<string>();

        const deg = new Map<string, number>();
        const stack = new Array<T>();

        for (let conf of this.BConfs()) {
            let nbor = this.adj.get(conf.toString())!;
            deg.set(conf.toString(), nbor.length);
            if (nbor.length == 0) { // final winning configurations for the attacker
                stack.push(conf);
                this.attractor.add(conf.toString());
            }
        }

        while (stack.length > 0) {
            const elem = stack.pop()!;

            for (const pred of this.reverse_adj.get(elem.toString())!) {
                const rpred = pred.toString();
                if (!this.attractor.has(rpred) &&  (this.isAConf(pred) || Map_dec(deg, pred) == 0)) {
                    this.attractor.add(rpred);
                    stack.push(pred);
                }
            }
        }
    }

    answer(conf: T) {
        if (this.attractor === null)
            return null;
        for (const conf2 of this.adj.get(conf.toString())!) {
            if (!this.attractor.has(conf2.toString())) {
                return conf2;
            }
        }
        return null;
    }

    startingConf() {
        if (this.attractor === null)
            return null;
        for (const conf of this.AConfs()) {
            if (!this.attractor.has(conf.toString())) {
                return conf;
            }
        }
        return null;
    }
}

export class EDSArena extends Arena<Conf> {
    constructor(public n: number, public k: number) {
        super();
    }

    AConfs() {
        return sublists(this.n, this.k);
    }

    * BConfs() {
        for (let conf of sublists(this.n, this.k)) {
            for (let i = 0; i < this.n; i++) {
                if (!conf.includes(i))
                    yield conf.concat(i);
            }
        }
    }

    isAConf(conf: Conf) {
        return conf.length == this.k;
    }
    
    static computeArena(graph: GenericGraph, k: number, rulesName: "one"|"all") {
        const arena = new EDSArena(graph.V, k);
        const rules = makeRules(rulesName);
        if (rules === null)
            return null;
        for (const conf of arena.AConfs()) {
            arena.adj.set(conf.toString(), []);
            arena.reverse_adj.set(conf.toString(), []);
        }

        for (const conf of arena.BConfs()) {
            arena.adj.set(conf.toString(), []);
            arena.reverse_adj.set(conf.toString(), []);
        }


        for (const conf of arena.AConfs()) {
            for (const conf2 of rules.attackerPossibilities(graph, conf)) {
                arena.addEdge(conf, conf2);
            }

            for (let attack = 0; attack < graph.V; attack++) {
                if (!conf.includes(attack)) {
                    const conf2 = conf.concat(attack);
                    for (let conf3 of rules.guardsPossibilities(graph, conf2)) {
                        arena.addEdge(conf2, conf3);
                    }
                }
            }
        }
        arena.computeAttractor();
        return arena;
    }

    guardsWin(): Result {
        if (this.attractor === null)
            return { result: false, witness: null };

        for (const conf of this.AConfs()) {
            if (!this.attractor.has(conf.toString()))
                return { result: true, witness: conf };
        }
        return { result: false, witness: null }
    }

    guardsAnswer(graph: GenericGraph, guards: Conf, attack: number): Answer|null {
        const answer = this.answer(guards.concat(attack));
        if (!answer)
            return null;
        let nicePerm: Conf | null = null;
        for (const permGuards of permutations(guards)) {
            if (permGuards.every((guard, i) =>
                guard === answer[i] || graph.hasEdge(guard, answer[i]))) {
                nicePerm = permGuards;
                break;
            }
        }
        if (!nicePerm)
            return null;
        const shift: Shift = Array.from(filter(zip(nicePerm, answer), (pair) => pair[0] !== pair[1]));
        
        return {conf:answer, shift};
    }

}

function makeRules(name: "one"|"all") {
    if (name == "one")
        return new OneRules();
    else
        return new AllRules();
}

class OneRules {
    * guardsPossibilities(g: GenericGraph, conf: number[]) : Iterable<number[]> {
        const attack = conf[conf.length - 1];
        const guards = conf.slice(0, conf.length - 1);

        for (let i = 0; i < guards.length; i++) {
            if (g.hasEdge(guards[i], attack)) {
                const guards2 = Array.from(guards);
                guards2[i] = attack;
                guards2.sort((a, b) => a - b);
                yield guards2;
            }
        }
    }

    * attackerPossibilities(g: GenericGraph, guards: number[]) {
        for (let attack = 0; attack < g.V; attack++) {
            if (!guards.includes(attack)) {
                yield guards.concat(attack);
            }
        }
    }
}

export class AllRules extends OneRules {
    * guardsPossibilities(g: GenericGraph, conf: number[]) : Iterable<number[]> {
        const gconf = Array.from(conf);
        const attack = gconf.pop()!;
        for (const conf2 of this.multiMoves(g, gconf, 0)) {
            const conf3 = conf2.slice();
            conf3.sort((a, b) => a - b);
            if (allDifferent(conf3) && conf3.includes(attack))
                yield conf3;
        }
    }

    * multiMoves(g: GenericGraph, conf: number[], i: number): Iterable<number[]> {
        if (i == conf.length) {
            yield conf;
        }
        else {
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
