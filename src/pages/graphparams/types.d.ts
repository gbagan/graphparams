import {Result} from "@/lib/graph/types";
export {Result} from "@/lib/graph/types";
import {PlainGraph} from '@/lib/graph/types';
export {PlainGraph} from '@/lib/graph/types';

export type GraphParameter = {
    readonly cat: number;
    readonly hardness: number;
    readonly name: string;
    readonly fullname: string;
    readonly checked: boolean;
    readonly result: "computing" | Result | null;
}

export type Witness = {
    readonly name: string;
    readonly witness: ReadonlyArray<number>;
}

export type WorkerAction = { type: "graph", code: "string" } | { type: "param", graph : PlainGraph, param: GraphParameter };
