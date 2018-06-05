
import { copy, product } from "../operators";

import { path, petersen } from "../generate";

it("product P3 x P4", () => {
    const g1 = path(3);
    const g2 = path(4);
    const g = product(g1, g2);
    expect(g.V).toBe(12);
    expect([...g.edges()].length).toBe(17);
});

it("copy(petersen)", () => {
    const g = petersen().freeze();
    const g2 = copy(g);
    expect(g2.V).toBe(g.V);
    expect([...g2.adjs()]).toEqual([...g.adjs()]);
});
