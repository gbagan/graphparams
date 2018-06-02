import {range} from "../iter";
import AbstractGraph from "./abstractgraph";
import Graph from "./graph";
import {uniq} from "./util";

export default class MutableGraph extends AbstractGraph<"mutable"> {
    private padj: ReadonlyArray<number[]>;

    constructor(n: number) {
        super(n);
        this.padj = [...range(n)].map(() => []);
    }

    public adj(i: number) {
        return this.padj[i];
    }

    public addEdge(v: number, w: number) {
        if (!this.hasEdge(v, w)) {
            this.padj[v].push(w);
            this.padj[w].push(v);
        }
        return this;
    }

    public removeEdge(v: number, w: number) {
        const index = this.adj(v).indexOf(w);
        this.adj(v).splice(index, 1);
        const index2 = this.adj(w).indexOf(v);
        this.adj(w).splice(index2, 1);
        return this;
    }

    public addEdges(...edges: number[][]) {
        for (const [x, y] of edges) {
            this.addEdge(x, y);
        }
        return this;
    }

    public addPath(...path: number[]) {
        for (let i = 0; i < path.length - 1; i++) {
            this.addEdge(path[i], path[i + 1]);
        }
        return this;
    }

    public addCycle(...cycle: number[]) {
        this.addPath(...cycle);
        this.addEdge(cycle[0], cycle[cycle.length - 1]);
        return this;
    }

    public addClique(...clique: number[]) {
        for (let i = 0; i < clique.length - 1; i++) {
            for (let j = i + 1; j < clique.length; j++) {
                this.addEdge(clique[i], clique[j]);
            }
        }
        return this;
    }

    public clean() {
        for (let i = 0; i < this.V; i++) {
            const adj = uniq(this.padj[i]);
            this.padj[i].length = 0;
            this.padj[i].push(...adj);
        }
        return this;
    }

    public freeze(): Graph {
        return new Graph(this.V, this.padj.map(adj => Array.from(adj)));
    }
}
