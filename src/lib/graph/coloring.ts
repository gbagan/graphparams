import * as R from "ramda";
import Graph from "./graph";
import { Result } from "./types";
import * as iter from "../iter";

export const chromaticNumber = (g: Graph) => chromaticNumberAux(g, () => true);

function chromaticNumberAux(g: Graph, predicate: (x: number[]) => boolean) {
    let i = 2;
    const precol = new Array(g.V);
    precol.fill(-1);
    const uncol = new Set(R.range(0, g.V));
    while (true) {
        const usedColor = new Array<boolean>(i);
        usedColor.fill(false);
        const res = chromaticAux(g, precol, uncol, i, usedColor, predicate);
        if (res.result) {
            return { result: i, witness: res.witness };
        }
        i++;
    }
}

function chromaticAux(g: Graph, precol: number[], uncol: Set<number>, maxcol: number, usedColor: boolean[],
                      predicate: (col: number[]) => boolean): Result {
    if (uncol.size === 0) {
        return predicate(precol) ? { result: true, witness: precol } : { result: false, witness: null };
    }
    const v = iter.min(uncol, (w) => iter.count<number>(g.adj[w], (u) => precol[u] !== -1)).elem;
    const uncol2 = new Set(uncol);
    uncol2.delete(v);
    let newColor = true;
    for (let i = 0; i < maxcol; i++) {
        if (g.adj[v].some(u => precol[u] === i) || (!usedColor[i] && !newColor)) {
            continue;
        }
        let usedColor2: boolean[];
        if (!usedColor[i]) {
            newColor = false;
            usedColor2 = [...usedColor];
            usedColor2[i] = true;
        } else {
            usedColor2 = usedColor;
        }

        const precol2 = [...precol];
        precol2[v] = i;

        const res = chromaticAux(g, precol2, uncol2, maxcol, usedColor2, predicate);
        if (res.result) {
            return res;
        }
    }
    return { result: false, witness: null };
}

function isDominatorColoring(g: Graph, col: number[]) {
    const n = Math.max(...col) + 1;
    const classes = new Array<number[]>(n);
    for (let i = 0; i < n; i++) {
        classes[i] = [];
    }

    for (let i = 0; i < g.V; i++) {
        classes[col[i]].push(i);
    }

    for (const clas of classes) {
        if (clas.length === 0) {
            return false;
        }
    }

    for (let i = 0; i < g.V; i++) {
        if (classes[col[i]].length >= 2 && !classes.some(clas =>
            clas.every((x) => g.hasEdge(i, x)))) {
            return false;
        }
    }
    return true;
}

function isTotalDominatorColoring(g: Graph, col: number[]) {
    const n = Math.max(...col) + 1;
    const classes = new Array<number[]>(n);
    for (let i = 0; i < n; i++) {
        classes[i] = [];
    }

    for (let i = 0; i < g.V; i++) {
        classes[col[i]].push(i);
    }

    for (const clas of classes) {
        if (clas.length === 0) {
            return false;
        }
    }

    for (let i = 0; i < g.V; i++) {
        if (!classes.some((clas) =>
            clas.every((x) => g.hasEdge(i, x)))) {
            return false;
        }
    }
    return true;
}

function isDominatedColoring(g: Graph, col: number[]) {
    const n = Math.max(...col) + 1;
    const classes = new Array<number[]>(n);
    for (let i = 0; i < n; i++) {
        classes[i] = [];
    }

    for (let i = 0; i < g.V; i++) {
        classes[col[i]].push(i);
    }

    for (const clas of classes) {
        if (!iter.some(iter.range(g.V), (v) =>
            clas.every((u) => g.hasEdge(u, v)))) {
            return false;
        }
    }
    return true;
}

export const dominatorColoring = (g: Graph) => chromaticNumberAux(g, x => isDominatorColoring(g, x));

export const totalDominatorColoring = (g: Graph) =>
    g.adj.some(nbor => nbor.length === 0) ?
        { result: Infinity, witness: null } : chromaticNumberAux(g, x => isTotalDominatorColoring(g, x));

export const dominatedColoring = (g: Graph) => chromaticNumberAux(g, x => isDominatedColoring(g, x));
