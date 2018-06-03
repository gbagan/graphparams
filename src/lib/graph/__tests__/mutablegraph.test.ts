import MutableGraph from "../mutablegraph";

it("addPath", () => {
    const g = new MutableGraph(3).addPath(0, 1, 2);
    expect(g.V).toBe(3);
    expect([...g.edges()].length).toBe(2);
});

it("addCycle", () => {
    const g = new MutableGraph(4).addCycle(0, 1, 2, 3);
    expect(g.V).toBe(4);
    expect([...g.edges()].length).toBe(4);
});

it("addClique", () => {
    const g = new MutableGraph(4).addClique(0, 1, 2, 3);
    expect(g.V).toBe(4);
    expect([...g.edges()].length).toBe(6);
});
