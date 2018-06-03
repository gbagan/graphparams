import { range } from "../iter";
import Graph from "./graph";

type LBFSPartition = {
    set: Set<number>;
    new_: boolean;
    next: LBFSPartition | null;
    previous: LBFSPartition | null;
};

class LexBFS {
    private graph: Graph;
    private partitions: Array<LBFSPartition | null>;
    private firstPartition: LBFSPartition;

    constructor(graph: Graph) {
        this.graph = graph;
        const partition: LBFSPartition = {
            new_: false,
            next: null,
            previous: null,
            set: new Set(range(graph.V)),
        };
        this.firstPartition = partition;
        this.partitions = new Array(graph.V);
        this.partitions.fill(partition);
    }

    public *execute(n: number) {
        let v = n;
        while (true) {
            yield v;
            this.refine(v);
            if (this.firstPartition === null) {
                return;
            }
            v = this.firstElement();
        }
    }

    private firstElement() {
        return this.firstPartition.set.values().next().value;
    }

    private addToPartitionBefore(partition: LBFSPartition, v: number) {
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
        if (partition === this.firstPartition) {
            this.firstPartition = partition.previous;
        }
        partition.previous.set.add(v);
        this.partitions[v] = partition.previous;
    }

    private removePartition(part: LBFSPartition) {
        if (part.previous) {
            part.previous.next = part.next;
        }
        if (part.next) {
            part.next.previous = part.previous;
        }
        if (part === this.firstPartition) {
            this.firstPartition = part.next!;
        }
    }

    private refine(v: number) {
        const partition = this.partitions[v]!;
        partition.set.delete(v);
        if (partition.set.size === 0) {
            this.removePartition(partition);
        }
        this.partitions[v] = null;

        for (const u of this.graph.adj(v)) {
            const partition2 = this.partitions[u];
            if (!partition2) {
                continue;
            }
            partition2.set.delete(u);
            this.addToPartitionBefore(this.partitions[u]!, u);
        }
        let part2: LBFSPartition | null = this.firstPartition;
        while (part2) {
            part2.new_ = false;
            if (part2.set.size === 0) {
                this.removePartition(part2);
            }
            part2 = part2.next;
        }
    }
}

const lexbfs = (graph: Graph, v: number) => new LexBFS(graph).execute(v);
export default lexbfs;
