import {every, range} from "../../iter";
import * as basic from "../basic";
import {biclique, clique, graph, path, petersen} from "../generate";
import MutableGraph from "../mutablegraph";

const checkHamiltonian = (g: MutableGraph, expectedRes: boolean) => () => {
    const res = basic.isHamiltonian(g.freeze());
    expect(res.result).toBe(expectedRes);
    if (expectedRes) {
        const p = res.witness;
        const test = p && p.length === g.V &&
            (g.V === 1 || g.V >= 3 && every(range(g.V), i => g.hasEdge(p[i], p[i + 1 === g.V ? 0 : i  + 1])));
        expect(test).toBe(true);
    }
};

it("isConnected(I1)", () => {
    const g = graph(1).freeze();
    expect(basic.isConnected(g)).toBe(true);
});

it("isConnected(P6)", () => {
    const g = graph(6).addPath(3, 2, 4, 1, 0, 5).freeze();
    expect(basic.isConnected(g)).toBe(true);
});

it("isConnected(P2 + P4)", () => {
    const g = graph(6).addPath(0, 1).addPath(4, 3, 2, 5).freeze();
    expect(basic.isConnected(g)).toBe(false);
});

it("degeneracy(I6)", () => {
    const g = graph(6).freeze();
    expect(basic.degeneracy(g).result).toBe(0);
});

it("degeneracy(P6)", () => {
    const g = graph(6).addPath(3, 2, 4, 1, 0, 5).freeze();
    expect(basic.degeneracy(g).result).toBe(1);
});

it("degeneracy(K6)", () => {
    const g = clique(6).freeze();
    expect(basic.degeneracy(g).result).toBe(5);
});

it("hamiltonian(I1)", checkHamiltonian(graph(1), true));
it("hamiltonian(P2)", checkHamiltonian(path(2), false));
it("hamiltonian(K3,3)", checkHamiltonian(biclique(3, 3), true));
it("hamiltonian(K3,4)", checkHamiltonian(biclique(3, 4), false));
it("hamiltonian(petersen)", checkHamiltonian(petersen(), false));
