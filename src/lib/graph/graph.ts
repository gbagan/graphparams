import * as R from "ramda";
import {uniq} from "../util";
import {PlainGraph} from "./types";

export default class Graph  {
    public V: number;
    public adj: number[][];

    constructor(n: number) {
        this.V = n;
        this.adj = R.times(_ => [], n);
    }
    
    public * edges(): Iterable<[number, number]> {
        for (let i = 0; i < this.V; i++) {
            for (const j of this.adj[i]) {
                if (i < j) {
                    yield [i, j];
                }
            }
        }
    }

    public hasEdge(v: number, w: number) {
        return this.adj[v].includes(w);
    }

    public edgeId(x: number, y: number) {
        return x < y ? x * this.V + y : y * this.V + x;
    }


    public toPlainObject(): PlainGraph {
        return {
            V: this.V,
            adj: this.adj,
            digraph: false,
        };
    }


    public addEdge(v: number, w: number) {
        if (!this.hasEdge(v, w)) {
            this.adj[v].push(w);
            this.adj[w].push(v);
        }
        return this;
    }

    public removeEdge(v: number, w: number) {
        const index = this.adj[v].indexOf(w);
        this.adj[v].splice(index, 1);
        const index2 = this.adj[w].indexOf(v);
        this.adj[w].splice(index2, 1);
        return this;
    }


    public clean() {
        for (let i = 0; i < this.V; i++) {
            const adj = uniq(this.adj[i].sort());
            this.adj[i].length = 0;
            this.adj[i].push(...adj);
        }
        return this;
    }
}

export function fromPlainObject(object: PlainGraph) {
    const g = new Graph(object.V);
    g.adj = object.adj;
    return g;
}
