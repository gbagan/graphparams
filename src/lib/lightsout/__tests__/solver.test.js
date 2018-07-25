import {ranges, times} from '@fp';
import solve from '../solver';

it("5x5 empty", () => {
    const conf = new Arra(25);
    conf.fill(0);
    const sols = [...solve(conf, 5, 5, 2)];
    expect(sols.length).toBe(4);
    expect(sols[0]).toEqual(conf);
});

it("6x6 full", () => {
    const conf = times(_ => 1, 36);
    const sols = [...solve(conf, 6, 6, 2)];
    const t = [1, 4, 6, 11, 24, 29, 31, 34];
    const expectedSol = [...range(36)].map(i => t.includes(i) ? 0 : 1);
    expect(sols.length).toBe(1);
    expect(sols[0]).toEqual(expectedSol);
});

it("6x6 cross", () => {
    const t = [3, 8, 9, 10, 15];
    const conf = range(0, 36).map(i => t.includes(i) ? 1 : 0);
    const sols = [...solve(conf, 6, 6, 2)];
    const expectedSol = range(0, 36).map(i => i === 9 ? 1 : 0);
    expect(sols.length).toBe(1);
    expect(sols[0]).toEqual(expectedSol);
});
