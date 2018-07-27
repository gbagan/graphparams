import memoize from '../memoize';

it('memoize', () => {
    let c = 0;
    const fn = (a, b) => { c++; return a + b; };
    const fn2 = memoize(fn);

    const res1 = fn2(3, 4);
    expect(res1).toBe(7);
    expect(c).toBe(1);

    const res2 = fn2(3, 4);
    expect(res2).toBe(7);
    expect(c).toBe(1);

    const res3 = fn2(2, 2);
    expect(res3).toBe(4);
    expect(c).toBe(2);
});