import {makeArena} from "../edsarena";
import {cycle, sun} from "../../graph/generate";

it("C6, all guards rules, k=2", () => {
    const g = cycle(6);
    const arena = makeArena(g, 2, "all");
    expect(arena).not.toBeNull();
    const conf = arena!.startingConf();
    expect(conf).not.toBeNull();
    expect(conf!.length).toBe(2);
});

it("sun(3), one guard rules, only one guard moves", () => {
    const g = sun(3);
    const arena = makeArena(g, 3, "one");
    expect(arena).not.toBeNull();
    const answer = arena!.guardsAnswer(g, [0, 1, 2], 3);
    expect(answer).not.toBeNull();
    expect(answer!.conf.length).toBe(3);
    expect(answer!.shift.length).toBe(1);
});
