export enum CellType {
    White = 0,
    Unknown = 1,
    Black = 2,
}

export type Nonogram = {
    readonly width: number;
    readonly height: number;
    readonly rows: ReadonlyArray<ReadonlyArray<number>>;
    readonly columns: ReadonlyArray<ReadonlyArray<number>>;
    readonly cells: ReadonlyArray<CellType>;
};