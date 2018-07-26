import {copy, edges, graph} from '../graph';
import {join, complement, inducedGraph, product} from '../operators';
import {path, petersen} from '../generate';

it('product P3 x P4', () => {
    const g1 = path(3);
    const g2 = path(4);
    const g = product(g1, g2);
    expect(g.length).toBe(12);
    expect(edges(g).length).toBe(17);
});

it('copy(petersen)', () => {
    const g = petersen();
    const g2 = copy(g);
    expect(g2).toEqual(g);
});

it('complement', () => {
    const g = petersen();
    const g2 = complement(g);
    expect(g2.length).toBe(10);
});

it('join', () => {
    const g = graph(4);
    const g2 = join(g, g);
    expect(g2.length).toBe(8);
    expect(edges(g2).length).toBe(16);
});

it('inducedGraph', () => {
    const g = path(5);
    const g2 = inducedGraph([0, 2, 4], g);
    expect(g2.length).toBe(3);
    expect(edges(g2).length).toBe(0);
});
