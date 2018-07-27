import {decode, encode, subsets} from '../binary';

it('binaryEncode([])', () => {
    const res = encode([]);
    expect(res).toBe(0);
});

it('binaryEncode([0, 1, 3])', () => {
    const res = encode([0, 1, 3]);
    expect(res).toBe(11);
});

it('binaryDecode(0)', () => {
    const res = decode(0);
    expect(res).toEqual([]);
});

it('binaryDecode(11)', () => {
    const res = decode(11);
    expect(res).toEqual([0, 1, 3]);
});

it('bsubsets(0, 0)', () => {
    const res = subsets(0, 0);
    expect([...res]).toEqual([0]);
});

it('bsubsets(4, 1)', () => {
    const res = subsets(4, 1);
    expect([...res].sort((a, b) => a - b)).toEqual([1, 2, 4, 8]);
});

it('bsubsets(4, 4)', () => {
    const res = subsets(4, 4);
    expect([...res]).toEqual([15]);
});
