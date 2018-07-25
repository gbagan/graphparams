import {times} from '@fp';
import {uniq} from '../util';

export default class Graph {
    constructor(n) {
        this.V = n;
        this.adj = times(_ => [], n);
    }
    
    * edges() {
        for (let i = 0; i < this.V; i++) {
            for (const j of this.adj[i]) {
                if (i < j) {
                    yield [i, j];
                }
            }
        }
    }

    hasEdge(v, w) {
        return this.adj[v].includes(w);
    }

    edgeId(x, y) {
        return x < y ? x * this.V + y : y * this.V + x;
    }


    toPlainObject() {
        return {
            V: this.V,
            adj: this.adj,
            digraph: false,
        };
    }

    addEdge(v, w) {
        if (!this.hasEdge(v, w)) {
            this.adj[v].push(w);
            this.adj[w].push(v);
        }
        return this;
    }

    removeEdge(v, w) {
        const index = this.adj[v].indexOf(w);
        this.adj[v].splice(index, 1);
        const index2 = this.adj[w].indexOf(v);
        this.adj[w].splice(index2, 1);
        return this;
    }

    clean() {
        for (let i = 0; i < this.V; i++) {
            const adj = uniq(this.adj[i].sort());
            this.adj[i].length = 0;
            this.adj[i].push(...adj);
        }
        return this;
    }
}

export const fromPlainObject = object => {
    const g = new Graph(object.V);
    g.adj = object.adj;
    return g;
}
