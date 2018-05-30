import {
    uniq, equalArrays,
    binaryDecode, binaryEncode, allDifferent, subsets, bsubsets, arrayIntersection
} from "./util";
import * as iter from "../iter";
import lexbfs from "./lexbfs";
import maximumMatching from "./matching";
import treewidth from "./treewidth";
import { EDSArena } from "./arena";

export interface Result {
    readonly result: boolean | number;
    readonly witness: ReadonlyArray<number> | null
}

export type PlainGraph = {
    readonly digraph: boolean;
    readonly V: number;
    readonly adj: ReadonlyArray<ReadonlyArray<number>>;
}

type Adj<T extends "mutable" | "immutable"> = T extends "mutable" ? number[] : ReadonlyArray<number>; 

abstract class _Graph<T extends "mutable" | "immutable"> {
    V: number;

    constructor(n: number) {
        this.V = n;
    }

    abstract adj(i: number): Adj<T>;

    nbVertices() {
        return this.V;
    }

    *adjs() {
        for (let i = 0; i < this.V; i++)
            yield this.adj(i);
    }

    * edges(): Iterable<[number, number]> {
        for (let i = 0; i < this.V; i++) {
            for (let j of this.adj(i)) {
                if (i < j) {
                    yield [i, j];
                }
            }
        }
    }

    mutableCopy() {
        const g = new MutableGraph(this.V);
        for (let i = 0; i < this.V; i++)
            g.adj(i).push(...this.adj(i));
        return g;
    }


    hasEdge(v: number, w: number) {
        return this.adj(v).includes(w);
    }


    complement() {
        const g = new MutableGraph(this.V);
        for (let i = 0; i < this.V - 1; i++) {
            for (let j = i + 1; j < this.V; j++) {
                if (!this.hasEdge(i, j))
                    g.addEdge(i, j);
            }
        }
        return g;
    }

    product(g: GenericGraph) {
        const g2 = new MutableGraph(this.V * g.V);
        for (let i = 0; i < this.V; i++) {
            for (let j = 0; j < g.V; j++) {
                for (const ii of this.adj(i)) {
                    g2.addEdge(i * g.V + j, ii * g.V + j);
                }
                for (const jj of g.adj(j)) {
                    g2.addEdge(i * g.V + j, i * g.V + jj);
                }
            }
        }
        return g2;
    }

    inducedGraph(set: number[]) {
        const g = new MutableGraph(set.length);
        const reverse = new Map<number, number>();

        for (let i = 0; i < set.length; i++) {
            reverse.set(set[i], i);
        }

        for (let i = 0; i < set.length; i++) {
            for (let nbor of this.adj(set[i])) {
                if (reverse.has(nbor)) {  // a verifier
                    g.addEdge(i, reverse.get(nbor)!);
                }
            }
        }
        return g;
    }


    isConnected() { // assume that G is a non directed graph
        const visited = new Array<boolean>(this.V);
        const stack = new Array<number>();
        let nb_visited = 1;
        visited[0] = true;
        stack.push(0);
        while (stack.length > 0) {
            const u = stack.pop()!;
            for (let w of this.adj(u)) {
                if (!visited[w]) {
                    stack.push(w);
                    visited[w] = true;
                    nb_visited++;
                }
            }
        }
        return nb_visited == this.V;
    }

    isRegular() {
        return this.minDegree() === this.maxDegree();
    }

    isHamiltonian() {
        return this.hamiltonAux([0]);
    }

    hamiltonAux(path: number[]): Result {
        const last = path[path.length - 1];
        if (path.length == this.V) {
            if (this.hasEdge(path[0], last))
                return { result: true, witness: path }
            else
                return { result: false, witness: null }
        } else {
            for (const v of this.adj(last)) {
                if (path.includes(v))
                    continue;
                const res = this.hamiltonAux(path.concat(v));
                if (res.result) {
                    return res;
                }
            }
            return { result: false, witness: null }
        }
    }

    nbEdges() {
        return iter.sum(this.adjs(), nbor => nbor.length) / 2;
    }

    minDegree() {
        return iter.min(this.adjs(), nbor => nbor.length).value;
    }

    maxDegree() {
        return iter.max(this.adjs(), (nbor) => nbor.length).value;
    }

    degeneracy(): Result {
        const set = new Set(iter.range(this.V));
        const order: number[] = [];
        let maxdegree = 0;
        while (set.size > 0) {
            let minDegree = Infinity;
            let bestVertex = null;
            for (const v of set) {
                const degree = iter.count<number>(this.adj(v), u => set.has(u));
                if (degree < minDegree) {
                    bestVertex = v;
                    minDegree = degree;
                }
            }
            set.delete(bestVertex!);
            order.push(bestVertex!);
            if (minDegree > maxdegree)
                maxdegree = minDegree;
        }

        return { result: maxdegree, witness: order }

    }

    eccentricity(v: number): Result {
        const distance = new Array<number>(this.V);
        const parent = new Array<number>(this.V);
        distance.fill(-1);
        parent.fill(-1);
        const queue = new Array<number>();
        let nb_visited = 1;
        distance[v] = 0;
        queue.push(v);
        while (queue.length > 0) {
            const u = queue.shift()!;
            for (let w of this.adj(u)) {
                if (distance[w] === -1) {
                    queue.push(w);
                    distance[w] = distance[u] + 1;
                    parent[w] = u;
                    nb_visited++;
                }
            }
        }


        if (nb_visited !== this.V) {
            return { result: Infinity, witness: null };
        } else {
            let u = iter.max(iter.range(this.V), w => distance[w]).elem;
            const path = [u];
            while (u !== v) {
                u = parent[u];
                path.push(u);
            }

            return { result: path.length - 1, witness: path.reverse() };
        }
    }

    private alternativePath(v1: number, v2: number) {
        const distance = new Array<number>(this.V);
        const parent = new Array<number>(this.V);
        distance.fill(-1);
        parent.fill(-1);
        const queue = new Array<number>();
        distance[v1] = 0;
        queue.push(v1);
        while (queue.length > 0) {
            const u = queue.shift()!;
            for (let w of this.adj(u)) {
                if (u == v1 && w == v2)
                    continue;
                if (distance[w] === -1) {
                    queue.push(w);
                    distance[w] = distance[u] + 1;
                    parent[w] = u;
                }
            }
        }


        if (distance[v2] === -1) {
            return { result: Infinity, witness: null };
        } else {
            const path = [v2];
            let u = v2;
            while (u !== v1) {
                u = parent[u];
                path.push(u);
            }

            return { result: path.length - 1, witness: path };
        }
    }

    girth(): Result {
        let bestRes: Result = { result: Infinity, witness: null };
        for (const [u, v] of this.edges()) {
            const res = this.alternativePath(u, v);
            if (res.result !== Infinity && res.result + 1 < bestRes.result!)
                bestRes = { result: res.result + 1, witness: res.witness };
        }
        return bestRes;
    }

    diameter(): Result {
        let bestRes: Result = { result: -1, witness: null }
        for (let i = 0; i < this.V; i++) {
            const res = this.eccentricity(i);
            if (res.result! > bestRes.result!)
                bestRes = res;
        }
        return bestRes;
    }

    isChordal(): Result {
        const lbfs = [...lexbfs(this, 0)];
        const visited = new Set<number>();
        let isChordal = true;
        let witness: number[] = [];
        for (const v of lbfs) {
            const nbor = [...iter.filter<number>(this.adj(v), u => visited.has(u))];
            const res = this.hasClique(nbor);
            if (!res.result) {
                isChordal = false;
                witness = [v, res.witness![0], res.witness![1]];
                break;
            }
            visited.add(v);
        }
        if (isChordal)
            return {
                result: true,
                witness: lbfs
            }
        const i = lbfs.indexOf(witness[0]);
        const g2 = this.inducedGraph(lbfs.slice(0, i));
        const path = g2.alternativePath(lbfs.indexOf(witness[1]), lbfs.indexOf(witness[2])).witness!;
        return {
            result: false,
            witness: path.map((i) => lbfs[i]).concat(witness[0])
        }
    }

    treewidth(): number {
        return treewidth(this);
    }

    hasClique(set: number[]): Result {
        for (let i = 0; i < set.length - 1; i++)
            for (let j = i + 1; j < set.length; j++)
                if (!this.hasEdge(set[i], set[j]))
                    return { result: false, witness: [set[i], set[j]] }
        return { result: true, witness: null };
    }

    mis(): Result {   // for graphs
        let isets: number[][] = [[]];
        let i = 0;
        while (true) {
            const isets2: number[][] = [];

            for (const iset of isets) {
                const size = iset.length;
                const begin = size == 0 ? 0 : iset[size - 1] + 1;
                for (let ii = begin; ii < this.V; ii++) {
                    if (iset.every((jj) => !this.hasEdge(ii, jj))) {
                        isets2.push(iset.concat(ii));
                    }
                }
            }
            if (isets2.length == 0) {
                return { result: i, witness: isets[0] };
            }
            isets = isets2;
            i++;
        }
    }

    misOpt(): Result {
        let isets: number[] = [0];
        let i = 0;
        const nbors: number[] = [];
        for (const adj of this.adjs()) {
            nbors.push(binaryEncode(adj));
        }

        while (true) {
            const isets2: number[] = [];

            for (const iset of isets) {
                const begin = (i == 0) ? 0 : (32 - Math.clz32(iset));
                for (let ii = begin; ii < this.V; ii++) {
                    if ((iset & nbors[ii]) === 0) {
                        isets2.push(iset | (1 << ii));
                    }
                }
            }
            if (isets2.length === 0) {
                return { result: i, witness: binaryDecode(isets[0]) };
            }
            isets = isets2;
            i++;
        }
    }


    cliqueNumber() {   // for graphs
        return this.complement().mis();
    }

    cliqueNumberOpt() {   // for graphs
        return this.complement().misOpt();
    }

    independentDominatingSetOpt() {
        const nbors: number[] = [];
        for (const adj of this.adjs()) {
            nbors.push(binaryEncode(adj));
        }

        let isets: [number, number][] = [[0, 0]];
        let i = 0;
        while (true) {
            const isets2: [number, number][] = [];

            for (const [iset, dom] of isets) {
                const begin = (i == 0) ? 0 : (32 - Math.clz32(iset));
                for (let ii = begin; ii < this.V; ii++) {
                    if ((iset & nbors[ii]) === 0) {
                        const iset2 = iset | (1 << ii)
                        const dom2 = dom | (1 << ii) | nbors[ii];
                        if (dom2 + 1 == (1 << this.V))
                            return { result: i, witness: binaryDecode(iset2) };
                        isets2.push([iset2, dom2]);
                    }
                }

            }
            isets = isets2;
            i++;
        }
    }

    dominationNumber() {
        return this.dominationAux([], Array.from(iter.range(this.V)));
    }

    private dominationAux(preset: number[], undom: number[]): Result {
        if (undom.length === 0) {
            return { result: preset.length, witness: preset };
        }
        const v = undom[0];
        const nbor = this.adj(v).concat(v);

        var bestRes: Result = { result: Infinity, witness: null }
        for (const u of nbor) {
            if (preset.includes(u))
                continue;
            const undom2 = undom.filter((w) => u !== w && !this.hasEdge(u, w));
            const res = this.dominationAux(preset.concat(u), undom2);
            if (res.result! < bestRes.result!)
                bestRes = res;
        }
        return bestRes;
    }

    totalDominationNumber() {
        return this.totalDominationAux([], Array.from(iter.range(this.V)));
    }

    private totalDominationAux(preset: number[], undom: number[]): Result {
        if (undom.length === 0) {
            return { result: preset.length, witness: preset };
        }
        const v = undom[0];
        const nbor = this.adj(v).concat(v);

        var bestRes: Result = { result: Infinity, witness: null }
        for (const u of nbor) {
            if (preset.includes(u))
                continue;
            const undom2 = undom.filter((w) => !this.hasEdge(u, w));
            const res = this.totalDominationAux(preset.concat(u), undom2);
            if (res.result! < bestRes.result!)
                bestRes = res;
        }
        return bestRes;
    }


    connectedDominationNumber() {
        return this.connectedDominationAux([], Array.from(iter.range(this.V)), new Set());
    }

    private connectedDominationAux(preset: number[], undom: number[], adj: Set<number>): Result {
        if (undom.length === 0) {
            return { result: preset.length, witness: preset };
        }

        const v = 0;
        let candidates = preset.length === 0 ? new Set(this.adj(v).concat(v)) : adj;

        var bestRes: Result = { result: Infinity, witness: null }
        for (const u of candidates) {
            const undom2 = undom.filter((w) => u !== w && !this.hasEdge(u, w));
            const adj2 = new Set<number>(adj);
            for (const w of this.adj(u))
                if (!preset.includes(w))
                    adj2.add(w);
            adj2.delete(u);
            const res = this.connectedDominationAux(preset.concat(u), undom2, adj2);
            if (res.result! < bestRes.result!)
                bestRes = res;
        }
        return bestRes;
    }

    chromaticNumberAux(predicate: (x: number[]) => boolean) {
        let i = 2;
        const precol = new Array(this.V);
        precol.fill(-1);
        const uncol = new Set(iter.range(this.V));
        while (true) {
            const usedColor = new Array<boolean>(i);
            usedColor.fill(false);
            const res = this.chromaticAux(precol, uncol, i, usedColor, (col) => predicate(col));
            if (res.result) {
                return { result: i, witness: res.witness };
            }
            i++;
        }
    }

    chromaticNumber() {
        return this.chromaticNumberAux(() => true);
    }

    chromaticAux(precol: number[], uncol: Set<number>, maxcol: number, usedColor: boolean[], predicate: (col: number[]) => boolean): Result {
        if (uncol.size === 0)
            return predicate(precol) ? { result: true, witness: precol } : { result: false, witness: null };
        const v = iter.min(uncol, (w) => iter.count<number>(this.adj(w), (u) => precol[u] !== -1)).elem;
        const uncol2 = new Set(uncol);
        uncol2.delete(v);
        let newColor = true;
        for (let i = 0; i < maxcol; i++) {
            if (iter.some<number>(this.adj(v), u => precol[u] === i))
                continue;
            if (!usedColor[i] && !newColor)
                continue;
            let usedColor2: boolean[];
            if (!usedColor[i]) {
                newColor = false;
                usedColor2 = Array.from(usedColor);
                usedColor2[i] = true;
            } else {
                usedColor2 = usedColor;
            }

            const precol2 = Array.from(precol);

            precol2[v] = i;

            const res = this.chromaticAux(precol2, uncol2, maxcol, usedColor2, predicate);
            if (res.result) {
                return res;
            }
        }
        return { result: false, witness: null };
    }

    isIdentifyingCode(set: number[]) {
        const nborInSet: number[][] = [];
        for (let i = 0; i < this.V; i++) {
            const s = arrayIntersection(this.adj(i), set);
            if (s.length == 0 && !set.includes(i))
                return false;
            nborInSet.push(s);
        }
        for (let i = 0; i < this.V - 1; i++) {
            for (let j = i + 1; j < this.V; j++) {
                if (equalArrays(nborInSet[i], nborInSet[j])) {
                    return false;
                }
            }
        }
        return true;
    }

    identifyingCode(): Result {   // graph must be clean
        let i = 1;
        while (true) {
            for (const set of subsets(this.V, i)) {
                if (this.isIdentifyingCode(set))
                    return { result: set.length, witness: set };
            }
            i++;
        }
    }


    isIdentifyingCodeOpt(binNbors: number[], bset: number) {
        const nborInSet: number[] = [];
        for (let i = 0; i < this.V; i++) {
            const s = binNbors[i] & bset;
            if (s == 0)
                return false;
            nborInSet.push(s);
        }
        nborInSet.sort();
        return allDifferent(nborInSet);
    }

    identifyingCodeOpt(): Result {   // graph must be clean
        const binNbors: number[] = [];
        for (let j = 0; j < this.V; j++)
            binNbors.push(binaryEncode(this.adj(j).concat(j)));

        let i = 1;
        while (true) {
            for (const bset of bsubsets(this.V, i)) {
                if (this.isIdentifyingCodeOpt(binNbors, bset))
                    return { result: i, witness: binaryDecode(bset) };
            }
            i++;
        }
    }

    isLocatingDominatingSet(binNbors: number[], bset: number) {
        const nborInSet: number[] = [];
        for (let i = 0; i < this.V; i++) {
            if (((1 << i) & bset) == 0) {
                const s = binNbors[i] & bset;
                if (s == 0)
                    return false;
                nborInSet.push(s);
            }
        }
        nborInSet.sort();
        return allDifferent(nborInSet);
    }

    locatingDominatingSet(): Result {   // graph must be clean
        const binNbors: number[] = [];
        for (const nbor of this.adjs()) {
            binNbors.push(binaryEncode(nbor));
        }

        let i = 1;
        while (true) {
            for (const bset of bsubsets(this.V, i)) {
                if (this.isLocatingDominatingSet(binNbors, bset))
                    return { result: i, witness: binaryDecode(bset) };
            }
            i++;
        }
    }



    isDominatorColoring(col: number[]) {
        const n = Math.max(...col) + 1;
        const classes = new Array<number[]>(n);
        for (let i = 0; i < n; i++)
            classes[i] = [];

        for (let i = 0; i < this.V; i++)
            classes[col[i]].push(i);

        for (const clas of classes)
            if (clas.length == 0)
                return false;

        for (let i = 0; i < this.V; i++) {
            if (classes[col[i]].length >= 2 && !classes.some((clas) =>
                clas.every((x) => this.hasEdge(i, x))
            )) return false;
        }
        return true;
    }

    isTotalDominatorColoring(col: number[]) {
        const n = Math.max(...col) + 1;
        const classes = new Array<number[]>(n);
        for (let i = 0; i < n; i++)
            classes[i] = [];

        for (let i = 0; i < this.V; i++)
            classes[col[i]].push(i);

        for (const clas of classes)
            if (clas.length == 0)
                return false;

        for (let i = 0; i < this.V; i++) {
            if (!classes.some((clas) =>
                clas.every((x) => this.hasEdge(i, x))
            )) return false;
        }
        return true;
    }

    isDominatedColoring(col: number[]) {
        const n = Math.max(...col) + 1;
        const classes = new Array<number[]>(n);
        for (let i = 0; i < n; i++)
            classes[i] = [];

        for (let i = 0; i < this.V; i++)
            classes[col[i]].push(i);

        for (const clas of classes)
            if (!iter.some(iter.range(this.V), (v) =>
                clas.every((u) => this.hasEdge(u, v))))
                return false;
        return true;
    }

    dominatorChromaticNumber() {
        return this.chromaticNumberAux((x) => this.isDominatorColoring(x));
    }

    totalDominatorChromaticNumber() {
        if (iter.some(this.adjs(), nbor => nbor.length == 0))
            return { result: Infinity, witness: null }
        return this.chromaticNumberAux((x) => this.isTotalDominatorColoring(x));
    }

    dominatedChromaticNumber() {
        return this.chromaticNumberAux((x) => this.isDominatedColoring(x));
    }

    private ednAux(rules: "one" | "all"): Result {
        let i = 1;
        while (true) {
            const arena = EDSArena.computeArena(this, i, rules);
            const res = arena!.guardsWin();
            if (res.result)
                return { result: i, witness: res.witness }
            i++;
        }
    }

    edn() {
        return this.ednAux("one");
    }

    medn() {
        return this.ednAux("all");
    }

    maximumMatching(): Result {
        return maximumMatching(this);
    }

    public edgeId(x: number, y: number) {
        return x < y ? x * this.V + y : y * this.V + x;
    }

    union(g: GenericGraph) {
        const g2 = new MutableGraph(this.V + g.V);

        for (let u = 0; u < this.V; u++)
            for (const v of this.adj(u))
                g2.adj(u).push(v);

        for (let u = 0; u < g.V; u++)
            for (const v of g.adj(u))
                g2.adj(this.V + u).push(this.V + v);

        return g2;
    }

    join(g: GenericGraph): MutableGraph {
        return this.complement().union(g.complement()).complement();
    }

    lineGraph() {
        const edges = Array.from(this.edges());
        const m = new Map<string, number>();
        const g2 = new MutableGraph(edges.length);
        for (let i = 0; i < edges.length; i++)
            m.set(edges[i].toString(), i);
        for (let i = 0; i < this.V; i++) {
            const clique = iter.map(this.adj(i), j =>
                m.get(i < j ? [i, j].toString() : [j, i].toString())!);
            g2.addClique(...clique);
        }
        return g2;
    }
}

export function generatePetersen() {
    const g = new MutableGraph(10);

    for (let i = 0; i < 5; i++) {
        g.addEdge(i, (i + 1) % 5);
        g.addEdge(i + 5, (i + 2) % 5 + 5);
        g.addEdge(i, i + 5);
    }

    return g;
}

export function generateHajos(n: number) {
    const g = new MutableGraph(2 * n);
    for (let i = 0; i < n; i++) {
        g.addClique(i, i + n, (i + 1) % n);
    }
    return g;
}

export function generateSun(n: number) {
    const g = new MutableGraph(2 * n);
    g.addClique(...iter.range(n));
    for (let i = 0; i < n; i++) {
        g.addPath(i, i + n, (i + 1) % n);
    }
    return g;
}

export class Graph extends _Graph<any> {
    _adj: ReadonlyArray<ReadonlyArray<number>>

    constructor(n: number, adj: ReadonlyArray<ReadonlyArray<number>>) {
        super(n);
        this._adj = adj;
    }

    adj(i: number) {
        return this._adj[i];
    }

    toPlainObject(): PlainGraph {
        return {
            digraph: false,
            V: this.V,
            adj: this._adj
        }
    }
}

export function fromPlainObject(object: PlainGraph) {
    return new Graph(object.V, object.adj);
}

export class MutableGraph extends _Graph<any> {
    _adj: ReadonlyArray<number[]>

    constructor(n: number) {
        super(n);
        this._adj = Array.from(iter.range(n)).map(() => []);
    }

    adj(i: number) {
        return this._adj[i];
    }

    addEdge(v: number, w: number) {
        if (!this.hasEdge(v, w)) {
            this._adj[v].push(w);
            this._adj[w].push(v);
        }
        return this;
    }

    removeEdge(v: number, w: number) {
        const index = this.adj(v).indexOf(w);
        this.adj(v).splice(index, 1);
        const index2 = this.adj(w).indexOf(v);
        this.adj(w).splice(index2, 1);
        return this;
    }

    addEdges(...edges: number[][]) {
        for (let [x, y] of edges)
            this.addEdge(x, y);
        return this;
    }

    addPath(...path: number[]) {
        for (let i = 0; i < path.length - 1; i++)
            this.addEdge(path[i], path[i + 1]);
        return this;
    }

    addCycle(...cycle: number[]) {
        this.addPath(...cycle);
        this.addEdge(cycle[0], cycle[cycle.length - 1]);
        return this;
    }

    addClique(...clique: number[]) {
        for (let i = 0; i < clique.length - 1; i++)
            for (let j = i + 1; j < clique.length; j++)
                this.addEdge(clique[i], clique[j]);
        return this;
    }

    clean() {
        for (let i = 0; i < this.V; i++) {
            const adj = uniq(this._adj[i]);
            this._adj[i].length = 0;
            this._adj[i].push(...adj);
        }
        return this;
    }

    freeze(): Graph {
        return new Graph(this.V, this._adj.map(adj => Array.from(adj)));
    }
}

export type GenericGraph = _Graph<any>

export const edges = (graph: PlainGraph) => fromPlainObject(graph).edges();
