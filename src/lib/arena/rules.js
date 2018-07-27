import {update} from '@fp';
import {hasEdge} from '../graph/graph';
import {allDifferent} from '@/lib/sorted';

function * multiMoves(graph, conf, i) {
    if (i === conf.length) {
        yield conf;
    } else {
        for (const conf2 of multiMoves(graph, conf, i + 1)) {
            yield conf2;
            for (const nbor of graph[conf2[i]]) {
                yield update(i, nbor, conf2);
            }
        }
    }
}

function * attackerPossibilities(graph, guards) {
    for (let attack = 0; attack < graph.length; attack++) {
        if (!guards.includes(attack)) {
            yield guards.concat(attack);
        }
    }
}

function * oneGuardPossibilities (graph, conf) {
    const attack = conf[conf.length - 1];
    const guards = conf.slice(0, conf.length - 1);

    for (let i = 0; i < guards.length; i++) {
        if (hasEdge(graph, guards[i], attack)) {
            const guards2 = update(i, attack, guards);
            guards2.sort((a, b) => a - b);
            yield guards2;
        }
    }
}

function * allGuardsPossibilities (graph, conf) {
    const gconf = conf.slice();
    const attack = gconf.pop();
    for (const conf2 of multiMoves(graph, gconf, 0)) {
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
};

const allRules = {
    attackerPossibilities,
    guardsPossibilities: allGuardsPossibilities
};

export default name => name === 'one' ? oneRules : allRules;

