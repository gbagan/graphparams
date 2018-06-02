import {makeArena} from "../arena/edsarena";
import Graph from "./graph";
import { Result } from "./types";

function ednAux(g: Graph, rules: "one" | "all"): Result {
    let i = 1;
    while (true) {
        const arena = makeArena(g, i, rules);
        const res = arena!.guardsWin();
        if (res.result) {
            return { result: i, witness: res.witness };
        }
        i++;
    }
}

export const eds = (g: Graph) => ednAux(g, "one");
export const meds = (g: Graph) => ednAux(g, "all");
