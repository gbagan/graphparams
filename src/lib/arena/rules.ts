import {allDifferent} from "../util";
import Graph from "../graph/graph";

function * multiMoves(g: Graph, conf: number[], i: number): Iterable<number[]> {
    if (i === conf.length) {
        yield conf;
    } else {
        for (const conf2 of multiMoves(g, conf, i + 1)) {
            yield conf2;
            for (const nbor of g.adj[conf2[i]]) {
                const conf3 = Array.from(conf2);
                conf3[i] = nbor;
                yield conf3;
            }
        }
    }
}

function * attackerPossibilities(g: Graph, guards: number[]) {
    for (let attack = 0; attack < g.V; attack++) {
        if (!guards.includes(attack)) {
            yield guards.concat(attack);
        }
    }
}

function * oneGuardPossibilities (g: Graph, conf: number[]) {
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

function * allGuardsPossibilities (g: Graph, conf: number[]) {
    const gconf = Array.from(conf);
    const attack = gconf.pop()!;
    for (const conf2 of multiMoves(g, gconf, 0)) {
        const conf3 = conf2.slice();
        conf3.sort((a, b) => a - b);
        if (allDifferent(conf3) && conf3.includes(attack)) {
            yield conf3;
        }
    }
}

const oneRules = {
    attackerPossibilities,
    guardsPossibilities: oneGuardPossibilities
}

const allRules = {
    attackerPossibilities,
    guardsPossibilities: allGuardsPossibilities
}


export default (name: "one" | "all") => name === "one" ? oneRules : allRules;

