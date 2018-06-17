import * as R from "ramda";
import { ActionType, getType } from "typesafe-actions";

import * as actions from "./actions";

import {makeEDS, startingConf, guardsAnswer} from "@/lib/arena/edsarena";
import {EDSGraph} from "@/lib/arena/types";
import { memoize } from "@/lib/decorators";
import Graph from "@/lib/graph/graph";
import parse from "@/lib/graph/parser";
import { Shift } from "../types";

/*
const GRAPH_EXAMPLE =
    `graph(9)
.addClique(0, 1, 2)
.addPath(2, 3, 4)
.addCycle(4, 5, 6, 7)
.addEdges(1-5, 4-8)
.addEdge(3, 8)`;
*/

export type Action = ActionType<typeof actions>;

export type State = {
    graph: Graph | null;
    guards: number[] | null;
    shift: Shift | null;
    rules: "one" | "all";
};

const initialState: State = {
    graph: null,
    guards: null,
    rules: "all",
    shift: null,
};

const getEDS: (graph: Graph, rules: "one" | "all") => EDSGraph =
    memoize((graph: Graph, rules: "one" | "all") =>
    R.reduceWhile<number, EDSGraph>(
        (eds, i) => !startingConf(eds),
        (eds, i) =>  makeEDS(graph, i + 1, rules),
        makeEDS(graph, 1, rules),
        R.range(1, graph.V + 1)
    )
);

export default function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case getType(actions.selectVertex): {
            const { graph, guards, rules } = state;
            const v = action.payload;
            if (!graph || !guards || guards.includes(v)) {
                return state;
            }
            const eds = getEDS(graph, rules);
            const res = guardsAnswer(eds, guards, v);
            if (!res)
                return state;
            return { ...state, guards: res.conf, shift: res.shift };
        }
        case getType(actions.submitInput): {
            const { type, input, rules } = action.payload;
            let graph;
            if (type === "load") {
                const textdata = localStorage.getItem("graph-" + input);
                if (!textdata) {
                    return state;
                }
                const data: any = JSON.parse(textdata);
                const code = data.code as string;
                const result = parse(code);
                if (result instanceof Graph) {
                    graph = result;
                } else {
                    return state;
                }
            } else { // type === "generate":
                const result = parse(input);
                if (result instanceof Graph) {
                    graph = result;
                } else {
                    return state;
                }
            }
            const eds = getEDS(graph, rules);
            const guards = startingConf(eds);
            const gstate = guards ? { guards } : {};
            return { ...state, graph, rules, guards, ...gstate };
        }
        default:
            return state;
    }
}
