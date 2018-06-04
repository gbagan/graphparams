import isChordal from "../chordal";

import {petersen, sun} from "../generate";

it("petersen", () => {
    const g = petersen().freeze();
    const res = isChordal(g);
    expect(res.result).toBe(false);
    expect(res.witness!.length).toBe(5);
});

it("sun(4)", () => {
    const g = sun(4).freeze();
    const res = isChordal(g);
    expect(res.result).toBe(true);
    expect(res.witness!.length).toBe(8);
});
