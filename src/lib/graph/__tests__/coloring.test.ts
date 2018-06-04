import {every} from "../../iter";
import { chromaticNumber, dominatedColoring, dominatorColoring, totalDominatorColoring } from "../coloring";
import { graph, petersen } from "../generate";
import Graph from "../graph";

function isChromatic(g: Graph, col: ReadonlyArray<number> | null) {
    return col && col.length === g.V && every(g.edges(), e => col[e[0]] !== col[e[1]]);
}

it("chromaticNumber(C5)", () => {
    const g = graph(5).addCycle(0, 4, 2, 1, 3).freeze();
    const col = chromaticNumber(g);
    expect(isChromatic(g, col.witness)).toBe(true);
    expect(col.result).toBe(3);
});

it("chromaticNumber(C6)", () => {
    const g = graph(6).addCycle(0, 4, 5, 2, 1, 3).freeze();
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

it("dominatorColoring(petersen)", () => {
    const g = petersen().freeze();
    const col = dominatorColoring(g);
    expect(isChromatic(g, col.witness)).toBe(true);
    expect(col.result).toBe(5);
});

it("totalDominatorColoring(petersen)", () => {
    const g = petersen().freeze();
    const col = totalDominatorColoring(g);
    expect(isChromatic(g, col.witness)).toBe(true);
    expect(col.result).toBe(6);
});

it("dominatedColoring(petersen)", () => {
    const g = petersen().freeze();
    const col = dominatedColoring(g);
    expect(isChromatic(g, col.witness)).toBe(true);
    expect(col.result).toBe(4);
});
