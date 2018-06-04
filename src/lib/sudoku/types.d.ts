export type PosAndVal = {
    readonly row: number,
    readonly col: number,
    readonly value: number
}

export type Solution = ReadonlyArray<PosAndVal>;
