import {every} from "../../iter";
import { chromaticNumber } from "../coloring";
import { petersen } from "../generate";
import Graph from "../graph";
import MutableGraph from "../mutablegraph";

function isChromatic(g: Graph, col: ReadonlyArray<number> | null) {
    return col && col.length === g.V && every(g.edges(), e => col[e[0]] !== col[e[1]]);
}

it("chromaticNumber(C5)", () => {
    const g = new MutableGraph(5).addCycle(0, 4, 2, 1, 3).freeze();
    const col = chromaticNumber(g);
    expect(isChromatic(g, col.witness)).toBe(true);
    expect(col.result).toBe(3);
});

it("chromaticNumber(C6)", () => {
    const g = new MutableGraph(6).addCycle(0, 4, 5, 2, 1, 3).freeze();
    const col = chromaticNumber(g);
    expect(isChromatic(g, col.witness)).toBe(true);
    expect(col.result).toBe(2);
});

it("chromaticNumber(petersen)", () => {
    const g = petersen().freeze();
    const col = chromaticNumber(g);
    expect(isChromatic(g, col.witness)).toBe(true);
    expect(col.result).toBe(3);
});
