import {GenericGraph} from "./graph";
import { range } from "../iter";

interface LBFSPartition {
    set: Set<number>;
    new: boolean;
    next: LBFSPartition|null;
    previous: LBFSPartition|null;
}

class LexBFS {
    graph: GenericGraph;
    partitions: (LBFSPartition|null)[];
    firstPartition: LBFSPartition;

    constructor(graph: GenericGraph) {
        this.graph = graph;
        const partition: LBFSPartition = {
            set: new Set(range(graph.V)),
            new: false,
            next: null,
            previous: null
        }
        this.firstPartition = partition;
        this.partitions = new Array(graph.V);
        this.partitions.fill(partition);
    }

    firstElement() {
        return this.firstPartition.set.values().next().value;
    }

    addToPartitionBefore(partition: LBFSPartition, v: number) {
        if (partition.previous === null)
            partition.previous = {
                set: new Set(),
                new: true,
                previous: null,
                next: partition
            }
        else if (!partition.previous.new) {
            partition.previous = {
                set: new Set(),
                new: true,
                previous: partition.previous,
                next: partition
            }
            if (partition.previous.previous)
                partition.previous.previous.next = partition.previous;
        }
        if (partition === this.firstPartition)
            this.firstPartition = partition.previous;
        partition.previous.set.add(v);
        this.partitions[v] = partition.previous;
    }

    removePartition(part: LBFSPartition) {
        if (part.previous !== null)
            part.previous.next = part.next;
        if (part.next !== null)
            part.next.previous = part.previous;
        if (part === this.firstPartition)
            this.firstPartition = part.next as LBFSPartition;
    }

    refine(v: number) {
        const partition = this.partitions[v] as LBFSPartition;
        partition.set.delete(v);
        if (partition.set.size === 0) {
            this.removePartition(partition);
        }
        this.partitions[v] = null;
        
        for (const u of this.graph.adj(v)) {
            const partition = this.partitions[u];
            if (partition === null)
                continue;
            partition.set.delete(u);
            this.addToPartitionBefore(this.partitions[u] as LBFSPartition, u);
        }
        let part2: LBFSPartition|null = this.firstPartition;
        while (part2 !== null) {
            part2.new = false;
            if (part2.set.size === 0) {
                this.removePartition(part2);
            }
            part2 = part2.next;
        }
    }

    *execute(n: number) {
        let v = n;
        while (true) {
            yield v;
            this.refine(v);
            if (this.firstPartition === null)
                return;
            v = this.firstElement();
        }
    }
}

 const lexbfs = (graph: GenericGraph, v: number) => new LexBFS(graph).execute(v);
 export default lexbfs;