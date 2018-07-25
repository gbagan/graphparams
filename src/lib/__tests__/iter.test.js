import * as iter from "../iter";

it("range(0)", () => {
    const l = iter.range(0);
    expect(Array.from(l)).toEqual([]);
});

it("range(4)", () => {
    const l = iter.range(4);
    expect(Array.from(l)).toEqual([0, 1, 2, 3]);
});

it("range(2, 6)", () => {
    const l = iter.range(2, 6);
    expect(Array.from(l)).toEqual([2, 3, 4, 5]);
});

it("map([], x => x)", () => {
    const l = iter.map([], x => x);
    expect(Array.from(l)).toEqual([]);
});

it("map([1, 3, 4], x => x+1)", () => {
    const l = iter.map([1, 3, 4], x => x + 1);
    expect(Array.from(l)).toEqual([2, 4, 5]);
});

it("zip([1, 2], ['a', 'b'])", () => {
    const l = iter.zip([1, 2], ["a", "b"]);
    expect(Array.from(l)).toEqual([[1, "a"], [2, "b"]]);
});

it("zip([1, 2, 3], ['a', 'b'])", () => {
    const l = iter.zip([1, 2, 3], ["a", "b"]);
    expect(Array.from(l)).toEqual([[1, "a"], [2, "b"]]);
});

it("zip([1, 2, 3], ['a', 'b', 'c'])", () => {
    const l = iter.zip([1, 2], ["a", "b", "c"]);
    expect(Array.from(l)).toEqual([[1, "a"], [2, "b"]]);
});

it("filter([1, 2, 3, 4], x => x % 2 === 0)", () => {
    const l = iter.filter([1, 2, 3, 4], x => x % 2 === 0);
    expect(Array.from(l)).toEqual([2, 4]);
});

it("count([1, 2, 3, 4], x => x % 2 === 0)", () => {
    const y = iter.count([1, 2, 3, 4], x => x % 2 === 0);
    expect(y).toBe(2);
});

it("find([1, 2, 3, 4], x => x % 2 === 0)", () => {
    const y = iter.find([1, 2, 3, 4], x => x % 2 === 0);
    expect(y).toBe(2);
});

it("find([1, 2, 3, 4], x => x === 5)", () => {
    const y = iter.find([1, 2, 3, 4], x => x === 5);
    expect(y).toBe(null);
});

it("some([1, 2, 3, 4], x => x % 2 === 0)", () => {
    const y = iter.some([1, 2, 3, 4], x => x % 2 === 0);
    expect(y).toBe(true);
});

it("find([1, 2, 3, 4], x => x === 5)", () => {
    const y = iter.some([1, 2, 3, 4], x => x === 5);
    expect(y).toBe(false);
});

it("min([3, 4, 2, 5], x => x + 1)", () => {
    const y = iter.min([3, 4, 2, 5], x => x + 1);
    expect(y).toEqual({ elem: 2, value: 3 });
});

it("max([3, 5, 2, 4], x => x + 1)", () => {
    const y = iter.max([3, 5, 2, 4], x => x + 1);
    expect(y).toEqual({ elem: 5, value: 6 });
});

it("sum([])", () => {
    const y = iter.sum([]);
    expect(y).toBe(0);
});

it("sum([1, 2, 3])", () => {
    const y = iter.sum([1, 2, 3]);
    expect(y).toEqual(6);
});

it("isEqual([1, 'a', 3.0], [1, 'a', 3.0])", () => {
    const y = iter.isEqual([1, "a", 3.0], [1, "a", 3.0]);
    expect(y).toBe(true);
});

it("isEqual([{}], [{}])", () => {
    const y = iter.isEqual([{}], [{}]);
    expect(y).toBe(false);
});
