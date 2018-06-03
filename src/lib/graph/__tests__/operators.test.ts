import MutableGraph from "../mutablegraph";
import { product } from "../operators";

it("product P3 x P4", () => {
    const g1 = new MutableGraph(3).addPath(0, 1, 2);
    const g2 = new MutableGraph(4).addPath(0, 1, 2, 3);
    const g = product(g1, g2);
    expect(g.V).toBe(12);
    expect([...g.edges()].length).toBe(17);
});
