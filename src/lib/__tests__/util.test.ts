import * as util from "../util";

it("allDifferent([])", () => {
    const res = util.allDifferent([]);
    expect(res).toBe(true);
});

it("allDifferent([1, 3, 4])", () => {
    const res = util.allDifferent([1, 3, 4]);
    expect(res).toBe(true);
});

it("allDifferent([1, 4, 4, 5])", () => {
    const res = util.allDifferent([1, 4, 4, 5]);
    expect(res).toBe(false);
});

it("arrayIntersection([1, 3, 4, 6, 10], [1, 4, 7, 10])", () => {
    const res = util.arrayIntersection([1, 3, 4, 6, 10], [1, 4, 7, 10]);
    expect(res).toEqual([1, 4, 10]);
});

it("uniq([])", () => {
    const res = util.uniq([]);
    expect(res).toEqual([]);
});

it("uniq([2, 2, 3, 4, 4, 4, 5, 5])", () => {
    const res = util.uniq([2, 2, 3, 4, 4, 4, 5, 5]);
    expect(res).toEqual([2, 3, 4, 5]);
});

it("binaryEncode([])", () => {
    const res = util.binaryEncode([]);
    expect(res).toBe(0);
});

it("binaryEncode([0, 1, 3])", () => {
    const res = util.binaryEncode([0, 1, 3]);
    expect(res).toBe(11);
});

it("binaryDecode(0)", () => {
    const res = util.binaryDecode(0);
    expect(res).toEqual([]);
});

it("binaryDecode(11)", () => {
    const res = util.binaryDecode(11);
    expect(res).toEqual([0, 1, 3]);
});

it("bsubsets(0, 0)", () => {
    const res = util.bsubsets(0, 0);
    expect([...res]).toEqual([0]);
});

it("bsubsets(4, 1)", () => {
    const res = util.bsubsets(4, 1);
    expect([...res].sort((a, b) => a - b)).toEqual([1, 2, 4, 8]);
});

it("bsubsets(4, 4)", () => {
    const res = util.bsubsets(4, 4);
    expect([...res]).toEqual([15]);
});
