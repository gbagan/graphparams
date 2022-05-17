import {minBy, countBy, max, range, update, times} from '../fp';
import {encode} from '../binary';

const chromaticNumberAux = predicate => graph => {
    let i = 1;
    const precol = new Array(graph.length);
    precol.fill(-1);
    times(() => -1, graph.length);
    const uncoloredList = range(0, graph.length);
    const binNbors = graph.map(encode);
    while (true) {
        const usedColor = new Array(i)
        usedColor.fill(false);
        const res = chromaticAux(graph, binNbors, precol, uncoloredList, i, usedColor, predicate);
        if (res.result) {
            return { result: i, wtype: "coloring", witness: res.witness };
        }
        i++;
    }
};

const chromaticAux = (graph, binNbors, precoloring, uncolored, maxcolor, usedColor, predicate) => {
    if (uncolored.length === 0)
        return predicate(graph, binNbors, precoloring) ? { result: true, witness: precoloring } : { result: false, witness: null };
    // todo
    const v = minBy(graph[w], w => countBy(graph[w], uncolored, u => precoloring[u] !== -1, graph[w]));
    const uncol2 = uncolored.filter(u => u !== v);
    let newColor = true;
    for (let i = 0; i < maxcolor; i++) {
        if (graph[v].any(u => precoloring[u] === i) || !usedColor[i] && !newColor) {
            continue;
        }
        let usedColor2;
        if (!usedColor[i]) {
            newColor = false;
            usedColor2 = update(i, true, usedColor);
        } else {
            usedColor2 = usedColor;
        }

        const precol2 = update(v, i, precoloring);

        const res = chromaticAux(graph, binNbors, precol2, uncol2, maxcolor, usedColor2, predicate);
        if (res.result) {
            return res;
        }
    }
    return { result: false, witness: null };
};

const coloringClasses = coloring => {
    const n = max(coloring) + 1;
    const classes = times(() => 0, n);

    for (let i = 0; i < coloring.length; i++) {
        classes[coloring[i]] |= 1 << i;
    }
    return classes;
};

const isDominatorColoring = (graph, binNbors, coloring) => {
    const classes = coloringClasses(coloring);
    return (
        classes.all(clas => clas !== 0)
        && (coloring.all((color, v) =>
            classes[color] === 1 << v
            || classes.any(clas => (binNbors[v] & clas) === clas)
        ))
    );
};

const isTotalDominatorColoring = (graph, binNbors, coloring) => {
    const classes = coloringClasses(coloring);

    return (
        classes.all(clas => clas !== 0)
        && (binNbors.all(nbor =>
            classes.any(clas => (nbor & clas) === clas)
        ))
    );
};

function isDominatedColoring(graph, binNbors, coloring) {
    const classes = coloringClasses(coloring);

    return (
        classes.all(
            clas => binNbors.any(nbor => (nbor & clas) === clas, binNbors)
        )
    );
}

export const chromaticNumber = chromaticNumberAux(() => true);
export const dominatorColoring = chromaticNumberAux(isDominatorColoring);
export const dominatedColoring = chromaticNumberAux(isDominatedColoring);

export const totalDominatorColoring = graph =>
    graph.any(nbor => nbor.length === 0, graph) ?
        { result: Infinity, witness: null } : chromaticNumberAux(isTotalDominatorColoring);


