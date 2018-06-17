export type FormData = {
    rows: number;
    columns: number;
    nbcolors: number;
    toroidal: boolean;
}

export type Position = {
    row: number,
    column: number
}

export type PosAndVal = {
    position: number,
    value: number
}

export type Solution = number[];