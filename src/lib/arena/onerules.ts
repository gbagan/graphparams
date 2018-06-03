import Graph from "../graph/graph";

export default class OneRules {
    public * guardsPossibilities(g: Graph, conf: number[]): Iterable<number[]> {
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

    public * attackerPossibilities(g: Graph, guards: number[]) {
        for (let attack = 0; attack < g.V; attack++) {
            if (!guards.includes(attack)) {
                yield guards.concat(attack);
            }
        }
    }
}
