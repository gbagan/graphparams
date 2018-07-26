import {allDifferent, insert, uniq, intersection, difference} from '../sorted';

it('allDifferent([])', () => {
    const res = allDifferent([]);
    expect(res).toBe(true);
});

it('allDifferent([1, 3, 4])', () => {
    const res = allDifferent([1, 3, 4]);
    expect(res).toBe(true);
});

it('allDifferent([1, 4, 4, 5])', () => {
    const res = allDifferent([1, 4, 4, 5]);
    expect(res).toBe(false);
});

it('insert(2, [])', () => { 
    const res = insert(2, []);
    expect(res).toEqual([2]);
});

it('insert(2, [1, 2, 3])', () => {
    const list = [1, 2, 3]; 
    const res = insert(2, list);
    expect(res).toBe(list);
});

it('insert(3, [1, 2, 4])', () => {
    const res = insert(3, [1, 2, 4]);
    expect(res).toEqual([1, 2, 3, 4]);
});

it('intersection([1, 3, 4, 6, 10], [1, 4, 7, 10])', () => {
    const res = intersection([1, 3, 4, 6, 10], [1, 4, 7, 10]);
    expect(res).toEqual([1, 4, 10]);
});

it('difference([1, 3, 4, 6, 10], [1, 4, 7, 10])', () => {
    const res = difference([1, 3, 4, 6, 10], [1, 4, 7, 10]);
    expect(res).toEqual([3, 6]);
});


it('uniq([])', () => {
    const res = uniq([]);
    expect(res).toEqual([]);
});

it('uniq([2, 2, 3, 4, 4, 4, 5, 5])', () => {
    const res = uniq([2, 2, 3, 4, 4, 4, 5, 5]);
    expect(res).toEqual([2, 3, 4, 5]);
});