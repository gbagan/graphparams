import {makeEDS, guardsWin} from "../arena/edsarena";

const ednAux = (graph, rules) => {
    let i = 1;
    while (true) {
        const eds = makeEDS(graph, i, rules);
        const res = guardsWin(eds);
        if (res.result) {
            return { result: i, witness: res.witness };
        }
        i++;
    }
}

export const eds = graph => ednAux(graph, 'one');
export const meds = graph => ednAux(graph, 'all');
