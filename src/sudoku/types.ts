export interface PosAndVal {
    readonly row: number,
    readonly col: number,
    readonly value: number
}

export interface Position {
    readonly row: number,
    readonly col: number
}

export interface ModelCell {
    readonly fixed: boolean,
    readonly value: number
}

export interface Example  {
    readonly size: number;
    readonly fixedCells: ReadonlyArray<Readonly<[number, number, number]>>;
}

interface NameAndExample {
    readonly name: string;
    readonly data: Example;
}

interface NameAndBoard {
    readonly name: string;
    readonly data: number;
}

export type Examples = ReadonlyArray<NameAndExample>;
export type Boards = ReadonlyArray<NameAndBoard>;
export type Solution = ReadonlyArray<PosAndVal>;