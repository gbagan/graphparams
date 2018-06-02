export type Conf = ReadonlyArray<number>;
export type Shift = ReadonlyArray<Readonly<[number, number]>>;

export type Answer = {
    readonly conf: Conf,
    readonly shift: Shift,
};