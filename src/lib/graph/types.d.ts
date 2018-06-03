import Graph from "./graph";
import MutableGraph from "./mutablegraph";

export type Result = {
    readonly result: boolean | number;
    readonly witness: ReadonlyArray<number> | null
};

export type PlainGraph = {
    readonly digraph: boolean;
    readonly V: number;
    readonly adj: ReadonlyArray<ReadonlyArray<number>>;
};

export type GenericGraph = Graph | MutableGraph