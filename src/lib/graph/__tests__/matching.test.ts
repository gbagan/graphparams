import maximumMatching from "../matching";

import {graph, grid, petersen} from "../generate";

it("petersen", () => {
    const g = petersen().freeze();
    const res = maximumMatching(g);
    expect(res.result).toBe(5);
    expect(res.witness!.length).toBe(10);
});

it("grid(3, 4)", () => {
    const g = grid(3, 4).freeze();
    const res = maximumMatching(g);
    expect(res.result).toBe(6);
    expect(res.witness!.length).toBe(12);
});

it("P4", () => {
    const g = graph(4).addEdges([0, 1], [0, 2], [1, 3]).freeze();
    const res = maximumMatching(g);
    expect(res.result).toBe(2);
    expect(res.witness!.length).toBe(4);
});
