export type GraphInputData = {
    type: "load" | "generate",
    input: string,
    rules: "one" | "all"
}

export type Shift = ReadonlyArray<Readonly<[number,number]>>;