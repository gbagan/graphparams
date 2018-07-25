import {makeEDS, startingConf, guardsAnswer} from "../edsarena";
import {cycle, sun} from "../../graph/generate";

it("C6, all guards rules, k=2", () => {
    const g = cycle(6);
    const eds = makeEDS(g, 2, "all");
    const conf = startingConf(eds);
    expect(conf).not.toBeNull();
    expect(conf.length).toBe(2);
});

it("sun(3), one guard rules, only one guard moves", () => {
    const g = sun(3);
    const eds = makeEDS(g, 3, "one");
    expect(eds).not.toBeNull();
    const answer = guardsAnswer(eds, [0, 1, 2], 3);
    expect(answer).not.toBeNull();
    expect(answer.length).toBe(3);
//    expect(answer!.shift.length).toBe(1);
});
