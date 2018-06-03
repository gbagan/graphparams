import AbstractGraph from "./abstractgraph";
import {PlainGraph} from "./types";

export default class Graph extends AbstractGraph<"immutable"> {
    private padj: ReadonlyArray<ReadonlyArray<number>>;

    constructor(n: number, adj: ReadonlyArray<ReadonlyArray<number>>) {
        super(n);
        this.padj = adj;
    }

    public adj(i: number) {
        return this.padj[i];
    }

    public toPlainObject(): PlainGraph {
        return {
            V: this.V,
            adj: this.padj,
            digraph: false,
        };
    }
}

export function fromPlainObject(object: PlainGraph) {
    return new Graph(object.V, object.adj);
}
