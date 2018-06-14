import * as R from "ramda";
import Graph from "./graph";

type LBFSPartition = {
    set: Set<number>;
    new_: boolean;
    next: LBFSPartition | null;
    previous: LBFSPartition | null;
};


type LPartitions = {
    partitions: Array<LBFSPartition | null>;
    firstPartition: LBFSPartition;
}

function makePartitions(n: number): LPartitions {
    const partition: LBFSPartition = {
        new_: false,
        next: null,
        previous: null,
        set: new Set(R.range(0, n)),
    };
    return {
        firstPartition: partition,
        partitions: R.times(_ => partition, n),
    }
}

const firstElement = (parts: LPartitions) => parts.firstPartition.set.values().next().value;

function * execute(parts: LPartitions, graph: Graph, u: number) {
    let v = u;
    while (true) {
        yield v;
        refine(parts, graph, v);
        if (parts.firstPartition === null) {
            return;
        }
        v = firstElement(parts);
    }
}


function addToPartitionBefore(parts: LPartitions, partition: LBFSPartition, v: number) {
    if (partition.previous === null) {
        partition.previous = {
            new_: true,
            next: partition,
            previous: null,
            set: new Set(),
        };
    } else if (!partition.previous.new_) {
        partition.previous = {
            new_: true,
            next: partition,
            previous: partition.previous,
            set: new Set(),
        };
        if (partition.previous.previous) {
            partition.previous.previous.next = partition.previous;
        }
    }
    if (partition === parts.firstPartition) {
        parts.firstPartition = partition.previous;
    }
    partition.previous.set.add(v);
    parts.partitions[v] = partition.previous;
}

function removePartition(parts: LPartitions, part: LBFSPartition) {
    if (part.previous) {
        part.previous.next = part.next;
    }
    if (part.next) {
        part.next.previous = part.previous;
    }
    if (part === parts.firstPartition) {
        parts.firstPartition = part.next!;
    }
}

function refine(parts: LPartitions, graph: Graph, v: number) {
    const partition = parts.partitions[v]!;
    partition.set.delete(v);
    if (partition.set.size === 0) {
        removePartition(parts, partition);
    }
    parts.partitions[v] = null;

    for (const u of graph.adj[v]) {
        const partition2 = parts.partitions[u];
        if (!partition2) {
            continue;
        }
        partition2.set.delete(u);
        addToPartitionBefore(parts, parts.partitions[u]!, u);
    }
    let part2: LBFSPartition | null = parts.firstPartition;
    while (part2) {
        part2.new_ = false;
        if (part2.set.size === 0) {
            removePartition(parts, part2);
        }
        part2 = part2.next;
    }
}

const lexbfs = (graph: Graph, v: number) => execute(makePartitions(graph.V), graph,v);
export default lexbfs;
