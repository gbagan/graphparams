import parse from "../parser";

const invalidSyntax = text => () => expect(typeof parse(text)).toBe('string');
const isGraph = (text, V, E) => () => {
    const g = parse(text);
    expect(g).toBeInstanceOf(Graph);
    expect(g.V).toBe(V);
    expect([...g.edges()].length).toBe(E);
};

it("invalid syntax 1", invalidSyntax(""));
it("invalid syntax 2", invalidSyntax("xxxxx()"));
it("invalid syntax 3", invalidSyntax("graph(6"));
it("invalid syntax 4", invalidSyntax("32"));

it("empty graph", isGraph("graph(6)", 6, 0));
it("petersen", isGraph("petersen", 10, 15));
it("grid 3x3", isGraph("grid(3, 3)", 9, 12));
it("cycle(3).product(cycle(3))", isGraph("cycle(3).product(cycle(3))", 9, 18));

it("complex example", () => {
    const code = "graph(9).addEdge(0, 2).addEdges(0-1, 1-2).addPath(2, 3, 4).addCycle(4, 5, 6).addClique(6, 7, 8)";
    expect(parse(code)).toBeInstanceOf(Graph);
});
