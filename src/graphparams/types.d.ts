export {Result} from "../libs/graph/types";
import {Result} from "../libs/graph/types";
import {PlainGraph} from '../libs/graph/types';
export {PlainGraph} from '../libs/graph/types';

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