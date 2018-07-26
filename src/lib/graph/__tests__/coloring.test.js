import { all } from '@fp';
import { chromaticNumber, dominatedColoring, dominatorColoring, totalDominatorColoring } from '../coloring';
import { edges, graph } from '../graph';
import { petersen, path } from '../generate';
import { addCycle, union } from '../operators';

const isChromatic = (graph, coloring) =>
    coloring && coloring.length === graph.V && edges(graph) |> all(([u, v]) => coloring[u] !== coloring[v]);

describe('chromaticNumber', () => {
    it('C5', () => {
        const g = graph(5) |> addCycle([0, 4, 2, 1, 3]);
        const col = chromaticNumber(g);
        expect(isChromatic(g, col.witness)).toBe(true);
        expect(col.result).toBe(3);
    });

    it('C6', () => {
        const g = graph(6) |> addCycle([0, 4, 5, 2, 1, 3]);
        const col = chromaticNumber(g);
        expect(isChromatic(g, col.witness)).toBe(true);
        expect(col.result).toBe(2);
    });

    it('petersen', () => {
        const g = petersen();
        const col = chromaticNumber(g);
        expect(isChromatic(g, col.witness)).toBe(true);
        expect(col.result).toBe(3);
    });
});

describe('dominatorColoring', () => {
    it('P2 + P2 + P2', () => {
        const g = union(path(2), union(path(2), path(2)));
        const col = dominatorColoring(g);
        expect(isChromatic(g, col.witness)).toBe(true);
        expect(col.result).toBe(4);
    });

    it('petersen', () => {
        const g = petersen();
        const col = dominatorColoring(g);
        expect(isChromatic(g, col.witness)).toBe(true);
        expect(col.result).toBe(5);
    });
});

describe('totalDominatorColoring', () => {
    it('P2 + P2 + P2', () => {
        const g = union(path(2), union(path(2), path(2)));
        const col = totalDominatorColoring(g);
        expect(isChromatic(g, col.witness)).toBe(true);
        expect(col.result).toBe(6);
    });

    it('petersen', () => {
        const g = petersen();
        const col = totalDominatorColoring(g);
        expect(isChromatic(g, col.witness)).toBe(true);
        expect(col.result).toBe(6);
    });
});

describe('dominatedColoring', () => {
    it('petersen', () => {
        const g = petersen();
        const col = dominatedColoring(g);
        expect(isChromatic(g, col.witness)).toBe(true);
        expect(col.result).toBe(4);
    });

    it('P2 + P2 + P3', () => {
        const g = union(path(2), union(path(2), path(3)));
        const col = dominatedColoring(g);
        expect(isChromatic(g, col.witness)).toBe(true);
        expect(col.result).toBe(6);
    });
});