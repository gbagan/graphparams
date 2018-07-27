import {makeEDS, startingConf} from '../arena/edsarena';

const ednAux = (graph, rules) => {
    let i = 1;
    while (true) {
        const eds = makeEDS(graph, i, rules);
        const conf = startingConf(eds);
        if (conf) {
            return { result: i, witness: conf };
        }
        i++;
    }
}

export const eds = graph => ednAux(graph, 'one');
export const meds = graph => ednAux(graph, 'all');
