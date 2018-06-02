import { Map_dec } from "../graph/util";

export default abstract class Arena<T> {
    public adj: Map<string, T[]>;
    public reverseAdj: Map<string, T[]>;
    protected attractor: Set<string> | null;

    constructor() {
        this.adj = new Map();
        this.reverseAdj = new Map();
        this.attractor = null;
    }

    public startingConf() {
        if (this.attractor === null) {
            return null;
        }
        for (const conf of this.AConfs()) {
            if (!this.attractor.has(conf.toString())) {
                return conf;
            }
        }
        return null;
    }

    public addEdge(from: T, to: T) {
        this.adj.get(from.toString())!.push(to);
        this.reverseAdj.get(to.toString())!.push(from);
    }

    public computeAttractor() {
        this.attractor = new Set<string>();

        const deg = new Map<string, number>();
        const stack = new Array<T>();

        for (const conf of this.BConfs()) {
            const nbor = this.adj.get(conf.toString())!;
            deg.set(conf.toString(), nbor.length);
            if (nbor.length === 0) { // final winning configurations for the attacker
                stack.push(conf);
                this.attractor.add(conf.toString());
            }
        }

        while (stack.length > 0) {
            const elem = stack.pop()!;

            for (const pred of this.reverseAdj.get(elem.toString())!) {
                const rpred = pred.toString();
                if (!this.attractor.has(rpred) &&  (this.isAConf(pred) || Map_dec(deg, pred) === 0)) {
                    this.attractor.add(rpred);
                    stack.push(pred);
                }
            }
        }
    }

    protected abstract AConfs(): Iterable<T>;
    protected abstract BConfs(): Iterable<T>;
    protected abstract isAConf(conf: T): boolean;

    protected answer(conf: T) {
        if (!this.attractor) {
            return null;
        }
        for (const conf2 of this.adj.get(conf.toString())!) {
            if (!this.attractor.has(conf2.toString())) {
                return conf2;
            }
        }
        return null;
    }
}
