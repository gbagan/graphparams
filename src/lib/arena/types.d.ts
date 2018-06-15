import Graph from "../graph/graph";
export type Guards = number[];
export type Shift = {from: number, to: number}[];

export type Arena<T> = {
    AConfs: () => Iterable<T>;
    BConfs: () => Iterable<T>;
    isAConf: (conf: T) => boolean;
    neighbors: (conf: T) => Iterable<T>;
}

export type ArenaGraph<T> = Arena<T> & {
    adj: Map<string, T[]>;
    reverseAdj: Map<string, T[]>;
    attractor: Set<string>;
};

export type Answer = {
    conf: Guards,
    shift: Shift,
};

type EDSGraph = ArenaGraph<Guards> & {graph: Graph};