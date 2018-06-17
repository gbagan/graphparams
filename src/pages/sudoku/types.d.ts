export {PosAndVal, Solution} from "@/lib/sudoku/types";

export type Position = {
    row: number,
    col: number
}

export type ModelCell = {
    fixed: boolean,
    value: number
}

export type Example =  {
    size: number;
    fixedCells: [number, number, number][];
}

type NameAndExample = {
    name: string;
    data: Example;
}

type NameAndBoard = {
    name: string;
    data: number;
}

export type Examples = NameAndExample[];
export type Boards = NameAndBoard[];
