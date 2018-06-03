import {biclique, clique, cycle, graph, path} from "../generate";
import MutableGraph from "../mutablegraph";
import treewidth from "../treewidth";

const testTw = (g: MutableGraph, expectedRes: number) => {
    expect(treewidth(g.freeze())).toBe(expectedRes);
};

it("treewidth(I6)",   () => testTw(graph(6), 0));
it("treewidth(P6)",   () => testTw(path(6), 1));
it("treewidth(C6)",   () => testTw(cycle(6), 2));
it("treewidth(K3,3)", () => testTw(biclique(3, 3), 3));
it("treewidth(K6)",   () => testTw(clique(6), 5));
