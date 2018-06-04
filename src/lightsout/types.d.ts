export type FormData = {
    readonly rows: number;
    readonly columns: number;
    readonly nbColors: number;
    readonly toroidal: boolean;
}

export type Position = {
    readonly row: number,
    readonly column: number
}

export type PosAndVal = {
    readonly position: number,
    readonly value: number
}

export type Solution = ReadonlyArray<Number>;