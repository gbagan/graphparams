export {PosAndVal, Solution} from "../lib/sudoku/types";

export type Position = {
    readonly row: number,
    readonly col: number
}

export type ModelCell = {
    readonly fixed: boolean,
    readonly value: number
}

export type Example =  {
    readonly size: number;
    readonly fixedCells: ReadonlyArray<Readonly<[number, number, number]>>;
}

type NameAndExample = {
    readonly name: string;
    readonly data: Example;
}

type NameAndBoard = {
    readonly name: string;
    readonly data: number;
}

export type Examples = ReadonlyArray<NameAndExample>;
export type Boards = ReadonlyArray<NameAndBoard>;
