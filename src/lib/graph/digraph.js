/*
import { uniq } from "./util";
import {range} from "../iter"

export default class Digraph {
    V: number;
    adj: number[][];
    reverseAdj: number[][];

    constructor(n: number | string) {
        if (typeof n === "number") {
            this.V = n;
            this.adj = [];
            this.reverseAdj = [];

            for (let i = 0; i < this.V; i++) {
                this.adj.push([]);
                this.reverseAdj.push([]);
            }
        } else {
            const g2 = Digraph.generateGraph(n);
            this.V = g2.V;
            this.adj = g2.adj;
            this.reverseAdj = g2.reverseAdj;
        }
    }

    nbVertices() {
        return this.V;
    }

    * edges(): Iterable<[number, number]> {
        for (let i = 0; i < this.V; i++) {
            for (let j of this.adj[i]) {
                if (i < j) {
                    yield [i, j];
                }
            }
        }
    }

    hasEdge(v: number, w: number) {
        return this.adj[v].includes(w);
    }

    addEdge(v: number, w: number) {
        if (!this.hasEdge(v, w)) {
            this.adj[v].push(w);
            this.reverseAdj[w].push(v);
        }
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
        this.addEdge(cycle[cycle.length - 1], cycle[0]);
        return this;
    }

    clean() {
        for (let i = 0; i < this.V; i++) {
            this.adj[i] = uniq(this.adj[i]);
            this.reverseAdj[i] = uniq(this.reverseAdj[i]);
        }
    }

    isAcyclic() {
        const visited = new Array<boolean>(this.V);
        visited.fill(false);
        const indeg = new Array<number>(this.V);
        const queue = new Array<number>();

        for (let i = 0; i < this.V; i++) {
            indeg[i] = this.reverseAdj[i].length;
            if (indeg[i] == 0) {
                queue.push(i);
                visited[i] = true;
            }
        }

        while (queue.length > 0) {
            const v = queue.pop() as number;
            for (let nbor of this.adj[v]) {
                if (!visited[nbor] && --indeg[nbor] == 0) {
                    queue.push(nbor);
                    visited[nbor] = true;
                }
            }
        }

        return !visited.includes(false);
    }

    static generateGraph(name: string) {
        let res;

        if (res = /P(\d+)/.exec(name)) {
            const n = parseInt(res[1]);
            return new Digraph(n).addPath(...range(n));
        }

        else if (res = /C(\d+)/.exec(name)) {
            const n = parseInt(res[1]);
            return new Digraph(n).addCycle(...range(n));
        }

        throw "Unknown graph name";
    }

}
*/
