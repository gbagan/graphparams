import {range, times} from '../fp';

const makePartitions = nbVertices => {
    const partition = {
        new_: false,
        next: null,
        previous: null,
        set: new Set(range(0, nbVertices)),
    };
    return {
        firstPartition: partition,
        partitions: times(() => partition, nbVertices),
    };
};

const firstElement = partitions => partitions.firstPartition.set.values().next().value;

function * execute(partitions, graph, vertex) {
    let v = vertex;
    while (true) {
        yield v;
        refine(partitions, graph, v);
        if (partitions.firstPartition === null) {
            return;
        }
        v = firstElement(partitions);
    }
}


const addToPartitionBefore = (partitions, partition, vertex) => {
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
    if (partition === partitions.firstPartition) {
        partitions.firstPartition = partition.previous;
    }
    partition.previous.set.add(vertex);
    partitions.partitions[vertex] = partition.previous;
};

const removePartition = (partitions, partition) => {
    if (partition.previous) {
        partition.previous.next = partition.next;
    }
    if (partition.next) {
        partition.next.previous = partition.previous;
    }
    if (partition === partitions.firstPartition) {
        partitions.firstPartition = partition.next;
    }
};

const refine = (partitions, graph, vertex) => {
    const partition = partitions.partitions[vertex];
    partition.set.delete(vertex);
    if (partition.set.size === 0) {
        removePartition(partitions, partition);
    }
    partitions.partitions[vertex] = null;

    for (const u of graph[vertex]) {
        const partition2 = partitions.partitions[u];
        if (!partition2) {
            continue;
        }
        partition2.set.delete(u);
        addToPartitionBefore(partitions, partitions.partitions[u], u);
    }
    let partition2  = partitions.firstPartition;
    while (partition2) {
        partition2.new_ = false;
        if (partition2.set.size === 0) {
            removePartition(partitions, partition2);
        }
        partition2 = partition2.next;
    }
};

export default (graph, vertex) => [...execute(makePartitions(graph.length), graph, vertex)];
