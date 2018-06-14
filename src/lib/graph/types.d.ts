export type Result = {
    result: boolean | number;
    witness: number[] | null
};

export type PlainGraph = {
    digraph: boolean;
    V: number;
    adj: number[][];
};