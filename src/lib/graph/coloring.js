import {F, minBy, count, range, times} from '@fp';
import * as iter from "../iter";

export const chromaticNumber = graph => chromaticNumberAux(graph, () => true);

const chromaticNumberAux = (graph, predicate) => {
    let i = 2;
    const precol = new Array(graph.V);
    precol.fill(-1);
    const uncol = new Set(range(0, g.V));
    while (true) {
        const usedColor = times(F, i);
        const res = chromaticAux(graph, precol, uncol, i, usedColor, predicate);
        if (res.result) {
            return { result: i, witness: res.witness };
        }
        i++;
    }
}

const chromaticAux = (graph, precol, uncol, maxcol, usedColor, predicate) => {
    if (uncol.size === 0) {
        return predicate(precol) ? { result: true, witness: precol } : { result: false, witness: null };
    }
    const v = minBy(w => countBy(u => precol[u] !== -1, graph.adj[w]), uncol);  //// uncol is not an array
    const uncol2 = new Set(uncol);
    uncol2.delete(v);
    let newColor = true;
    for (let i = 0; i < maxcol; i++) {
        if (graph.adj[v].some(u => precol[u] === i) || (!usedColor[i] && !newColor)) {
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

        const precol2 = [...precol];
        precol2[v] = i;

        const res = chromaticAux(graph, precol2, uncol2, maxcol, usedColor2, predicate);
        if (res.result) {
            return res;
        }
    }
    return { result: false, witness: null };
}

const isDominatorColoring = (graph, col) => {
    const n = Math.max(...col) + 1;
    const classes = new Array(n);
    for (let i = 0; i < n; i++) {
        classes[i] = [];
    }

    for (let i = 0; i < graph.V; i++) {
        classes[col[i]].push(i);
    }

    for (const clas of classes) {
        if (clas.length === 0) {
            return false;
        }
    }

    for (let i = 0; i < g.V; i++) {
        if (classes[col[i]].length >= 2 && !classes.some(clas =>
            clas.every((x) => graph.hasEdge(i, x)))) {
            return false;
        }
    }
    return true;
}

const isTotalDominatorColoring = (graph, col) => {
    const n = Math.max(...col) + 1;
    const classes = new Array(n);
    for (let i = 0; i < n; i++) {
        classes[i] = [];
    }

    for (let i = 0; i < graph.V; i++) {
        classes[col[i]].push(i);
    }

    for (const clas of classes) {
        if (clas.length === 0) {
            return false;
        }
    }

    for (let i = 0; i < graph.V; i++) {
        if (!classes.some((clas) =>
            clas.every((x) => graph.hasEdge(i, x)))) {
            return false;
        }
    }
    return true;
}

function isDominatedColoring(graph, col) {
    const n = Math.max(...col) + 1;
    const classes = new Array(n);
    for (let i = 0; i < n; i++) {
        classes[i] = [];
    }

    for (let i = 0; i < graph.V; i++) {
        classes[col[i]].push(i);
    }

    for (const clas of classes) {
        if (!iter.some(iter.range(graph.V), v =>
            clas.every(u => graph.hasEdge(u, v)))) {
            return false;
        }
    }
    return true;
}

export const dominatorColoring = graph => chromaticNumberAux(graph, x => isDominatorColoring(g, x));

export const totalDominatorColoring = graph =>
    graph.adj.some(nbor => nbor.length === 0) ?
        { result: Infinity, witness: null } : chromaticNumberAux(graph, x => isTotalDominatorColoring(graph, x));

export const dominatedColoring = graph => chromaticNumberAux(graph, x => isDominatedColoring(graph, x));
