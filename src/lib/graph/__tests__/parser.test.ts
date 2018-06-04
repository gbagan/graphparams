import Graph from "../graph";
import parse from "../parser";

const invalidSyntax = (text: string) => () => expect(typeof parse(text)).toBe("string");
const isGraph = (text: string, V: number, E: number) => () => {
    const g = parse(text) as Graph;
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