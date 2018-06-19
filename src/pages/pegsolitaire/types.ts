export type Position = {
    row: number;
    col: number;
};

export type Peg = Position & {id: number};

export type Board = {
    pegs: Peg[];
    holes: Position[];
    rows: number;
    columns: number;
};
