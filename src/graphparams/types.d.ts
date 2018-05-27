import {Result} from "../libs/graph/graph";

export type GraphParameter = {
    readonly cat: number;
    readonly hardness: number;
    readonly name: string;
    readonly fullname: string;
    readonly method: string;
    readonly checked: boolean;
    readonly result: Result | null;
}

export {PlainGraph} from '../libs/graph/graph';