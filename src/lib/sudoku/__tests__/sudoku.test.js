import solve from '../solver';

it('no solution 1', () => {
    const cell1 = { row: 0, col: 0, value: 1 };
    const cell2 = { row: 0, col: 4, value: 1 };
    const solutions = [...solve(3, [cell1, cell2], 10)];
    expect(solutions.length).toBe(0);
});
