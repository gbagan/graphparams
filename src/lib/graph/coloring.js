import { all, any, F, minBy, countBy, filter, max, range, update, times } from '@fp';
import {hasEdge} from './graph';

export const chromaticNumber = graph => chromaticNumberAux(graph, () => true);

const chromaticNumberAux = (graph, predicate) => {
    let i = 2;
    const precol = times(() => -1, graph.length);
    const uncoloredList = range(0, graph.length);
    while (true) {
        const usedColor = times(F, i);
        const res = chromaticAux(graph, precol, uncoloredList, i, usedColor, predicate);
        if (res.result) {
            return { result: i, witness: res.witness };
        }
        i++;
    }
};

const chromaticAux = (graph, precol, uncol, maxcol, usedColor, predicate) => {
    if (uncol.length === 0) {
        return predicate(precol) ? { result: true, witness: precol } : { result: false, witness: null };
    }
    const v = minBy(w => countBy(u => precol[u] !== -1, graph[w]), uncol);
    const uncol2 = filter(u => u !== v, uncol);
    let newColor = true;
    for (let i = 0; i < maxcol; i++) {
        if (graph[v].some(u => precol[u] === i) || (!usedColor[i] && !newColor)) {
            continue;
        }
        let usedColor2;
        if (!usedColor[i]) {
            newColor = false;
            usedColor2 = usedColor.slice();
            usedColor2[i] = true;
        } else {
            usedColor2 = usedColor;
        }

        const precol2 = update(v, i, precol);

        const res = chromaticAux(graph, precol2, uncol2, maxcol, usedColor2, predicate);
        if (res.result) {
            return res;
        }
    }
    return { result: false, witness: null };
};

const coloringClasses = coloring => {
    const n = max(coloring) + 1;
    const classes = times(() => [], n);

    for (let i = 0; i < coloring.length; i++) {
        classes[coloring[i]].push(i);
    }
    return classes;
};

const isDominatorColoring = (graph, coloring) => {
    const classes = coloringClasses(coloring);

    return (
        all(clas => clas.length > 0, classes)
        && all(
            v => classes[coloring[v]].length >= 2 && any(
                clas => all(x => hasEdge(graph, v, x), clas),
                classes
            ),
            range(0, graph.length)
        )
    );
};

const isTotalDominatorColoring = (graph, coloring) => {
    const classes = coloringClasses(coloring);

    return (
        all(clas => clas.length > 0, classes)
        && all(
            v => any(
                clas => all(x => hasEdge(graph, v, x), clas),
                classes
            ),
            range(0, graph.length)
        )
    );
};

function isDominatedColoring(graph, coloring) {
    const classes = coloringClasses(coloring);
    const vertices = range(0, graph.length);

    return (
        all(
            clas => any(
                v => all(u => hasEdge(graph, u, v), clas),
                vertices
            ),
            classes
        )
    );
}

export const dominatorColoring = graph => chromaticNumberAux(graph, x => isDominatorColoring(graph, x));

export const totalDominatorColoring = graph =>
    any(nbor => nbor.length === 0, graph) ?
        { result: Infinity, witness: null } : chromaticNumberAux(graph, x => isTotalDominatorColoring(graph, x));

export const dominatedColoring = graph => chromaticNumberAux(graph, x => isDominatedColoring(graph, x));
