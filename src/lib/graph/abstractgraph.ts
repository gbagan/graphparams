type Adj<T extends "mutable" | "immutable"> = T extends "mutable" ? number[] : ReadonlyArray<number>;

export default abstract class AbstractGraph<T extends "mutable" | "immutable"> {
    public readonly V: number;

    constructor(n: number) {
        this.V = n;
    }

    public abstract adj(i: number): Adj<T>;

    public *adjs() {
        for (let i = 0; i < this.V; i++) {
            yield this.adj(i);
        }
    }

    public * edges(): Iterable<[number, number]> {
        for (let i = 0; i < this.V; i++) {
            for (const j of this.adj(i)) {
                if (i < j) {
                    yield [i, j];
                }
            }
        }
    }

    public hasEdge(v: number, w: number) {
        return this.adj(v).includes(w);
    }

    public edgeId(x: number, y: number) {
        return x < y ? x * this.V + y : y * this.V + x;
    }
}
