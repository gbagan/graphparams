import {all, range} from '@fp';
import * as basic from '../basic';
import {graph, hasEdge} from '../graph';
import {biclique, clique, cycle, path, petersen, star, sun} from '../generate';
import {addPath, union} from '../operators';

it('isRegular(petersen)', () => {
    const g = petersen();
    expect(basic.isRegular(g)).toBe(true);
});

it('isRegular(P4)', () => {
    const g = path(4);
    expect(basic.isRegular(g)).toBe(false);
});

const checkHamiltonian = (g, expectedRes) => () => {
    const res = basic.isHamiltonian(g);
    expect(res.result).toBe(expectedRes);
    if (expectedRes) {
        const p = res.witness;
        const test = p && p.length === g.length &&
            (g.length === 1 || g.length >= 3 && range(0, g.length) |> all(i => hasEdge(g, p[i], p[i + 1 === g.length ? 0 : i  + 1])));
        expect(test).toBe(true);
    }
};

const isIndependent = (g, set) =>
    set |> all(i => set |> all(j => !hasEdge(g, i, j)));

const isClique = (g, set) =>
    set |> all(i => set |> all(j => i === j || hasEdge(g, i, j)));

it('isConnected(I1)', () => {
    const g = graph(1);
    expect(basic.isConnected(g)).toBe(true);
});

it('isConnected(P6)', () => {
    const g = graph(6) |> addPath([3, 2, 4, 1, 0, 5]);
    expect(basic.isConnected(g)).toBe(true);
});

it('isConnected(P2 + P4)', () => {
    const g = graph(6) |> addPath([0, 1]) |> addPath([4, 3, 2, 5]);
    expect(basic.isConnected(g)).toBe(false);
});

it('degeneracy(I6)', () => {
    const g = graph(6);
    expect(basic.degeneracy(g).result).toBe(0);
});

it('degeneracy(P6)', () => {
    const g = graph(6) |> addPath([3, 2, 4, 1, 0, 5]);
    expect(basic.degeneracy(g).result).toBe(1);
});

it('degeneracy(K6)', () => {
    const g = clique(6);
    expect(basic.degeneracy(g).result).toBe(5);
});

it('hamiltonian(I1)', checkHamiltonian(graph(1), true));
it('hamiltonian(P2)', checkHamiltonian(path(2), false));
it('hamiltonian(K3,3)', checkHamiltonian(biclique(3, 3), true));
it('hamiltonian(K3,4)', checkHamiltonian(biclique(3, 4), false));
it('hamiltonian(petersen)', checkHamiltonian(petersen(), false));

it('girth(petersen)', () => {
    const g = petersen();
    const res = basic.girth(g);
    expect(res.result).toBe(5);
    expect(res.witness.length).toBe(5);
});

it('girth(star(4))', () => {
    const g = star(4);
    const res = basic.girth(g);
    expect(res.result).toBe(Infinity);
    expect(res.witness).toBeNull();
});

it('diameter(P8)', () => {
    const g = path(8);
    const res = basic.diameter(g);
    expect(res.result).toBe(7);
    expect(res.witness.length).toBe(8);
});

it('diameter(C7)', () => {
    const g = cycle(7);
    const res = basic.diameter(g);
    expect(res.result).toBe(3);
    expect(res.witness.length).toBe(4);
});

it('diameter(C3 + C3)', () => {
    const g = union(cycle(3), cycle(3));
    const res = basic.diameter(g);
    expect(res.result).toBe(Infinity);
    expect(res.witness).toBeNull();
});

it('mis(sun(4))', () => {
    const g = sun(4);
    const res = basic.mis(g);
    expect(res.result).toBe(4);
    expect(res.witness.length).toBe(4);
    expect(isIndependent(g, res.witness)).toBe(true);
});

it('cliqueNumber(sun(4))', () => {
    const g = sun(4);
    const res = basic.cliqueNumber(g);
    expect(res.result).toBe(4);
    expect(res.witness.length).toBe(4);
    expect(isClique(g, res.witness)).toBe(true);
});
