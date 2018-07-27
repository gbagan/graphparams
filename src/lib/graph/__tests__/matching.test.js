import maximumMatching from '../matching';
import {graph} from '../graph';
import {grid, petersen} from '../generate';
import {addEdges} from '../operators';

it('matching petersen', () => {
    const g = petersen();
    const res = maximumMatching(g);
    expect(res.result).toBe(5);
    expect(res.witness.length).toBe(5);
});

it('matching grid(3, 4)', () => {
    const g = grid(3, 4);
    const res = maximumMatching(g);
    expect(res.result).toBe(6);
    expect(res.witness.length).toBe(6);
});

it('matching P4', () => {
    const g = graph(4) |> addEdges([[0, 1], [0, 2], [1, 3]]);
    const res = maximumMatching(g);
    expect(res.result).toBe(2);
    expect(res.witness.length).toBe(2);
});
