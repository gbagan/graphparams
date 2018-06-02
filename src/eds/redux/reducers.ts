import { ActionType, getType } from "typesafe-actions";

import * as actions from "./actions";

import {makeArena} from "../../libs/arena/edsarena";
import { memoize } from "../../libs/decorators";
import Graph from "../../libs/graph/graph";
import parse from "../../libs/graph/graphparser";
import { Shift } from "../types";

const HELP_TEXT =
    `petersen     // petersen graph
graph(n)       // create an empty graph with n vertices
path(n)        // create a path graph with n vertices
cycle(n)       // create a cycle graph with n vertices
clique(n)      // create a complete graph with n vertices
star(n)        // create a star graph with n leaves
biclique(n, m) // create a bipartite complete graph
grid(n, m)     // create a grid of size n x m
sun(n)         // sun graph with 2n vertices
// methods
.addEdge(0, 2)
.addEdges(1-2, 2-3)
.removeEdge(1, 2)
.addPath(2, 3, 5)
.addCycle(2, 3, 5)
 .addClique(2, 3, 5)
 .complement()
 .lineGraph()
 .union(g2)
 .join(g2)
 .product(g2)  // cartesian product
 .product(graph(4).addCycle(0, 1, 2).addEdge(2, 3))

digraph(5)     // create an empty digraph with 5 vertices
digraph('name')  // name P5 | C5
.addPath(0, 2, 3)
.addCycle(1, 2, 3)
.addEdges([0-2], [2-3])`;
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
    readonly graph: Graph | null;
    readonly guards: ReadonlyArray<number> | null;
    readonly shift: Shift | null;
    readonly rules: "one" | "all";
    readonly helpText: string;
};

const initialState: State = {
    graph: null,
    guards: null,
    helpText : HELP_TEXT,
    rules: "all",
    shift: null,
};

const getArena = memoize((graph: Graph, rules: "one" | "all") => {
    let i = 1;
    while (true) {
        const arena = makeArena(graph, i, rules);
        if (arena && arena.startingConf()) {
            return arena;
        }
        i++;
    }
});

export default function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case getType(actions.selectVertex): {
            const { graph, guards, rules } = state;
            const v = action.payload;
            if (!guards || guards.includes(v)) {
                return state;
            }
            const arena = getArena(graph, rules);
            const res = arena.guardsAnswer(graph, guards, v);
            if (!res) {
                return state;
            }
            const { conf, shift } = res;
            return { ...state, guards: conf, shift };
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
            const arena = getArena(graph, rules);
            const guards = arena.startingConf();
            const gstate = guards ? { guards } : {};
            return { ...state, graph, rules, guards, ...gstate };
        }
        default:
            return state;
    }
}
