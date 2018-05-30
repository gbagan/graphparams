export {Result} from "../libs/graph/graph";
import {Result} from "../libs/graph/graph";

export type GraphParameter = {
    readonly cat: number;
    readonly hardness: number;
    readonly name: string;
    readonly fullname: string;
    readonly method: string;
    readonly checked: boolean;
    readonly result: "computing" | Result | null;
}

export type Witness = {
    readonly name: string;
    readonly witness: ReadonlyArray<number>;
}

import {PlainGraph} from '../libs/graph/graph';
export {PlainGraph} from '../libs/graph/graph';

export type WorkerAction = { type: "graph", code: "string" } | { type: "param", graph : PlainGraph, param: GraphParameter };