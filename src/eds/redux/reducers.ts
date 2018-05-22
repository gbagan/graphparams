import { getType, ActionType, } from 'typesafe-actions';

import * as actions from './actions';
 
import { Shift } from "../types"
import { Graph } from '../../libs/graph/graph';
import { EDSArena } from '../../libs/graph/arena';
import parse from '../../libs/graph/graphparser';
import { memoize } from '../../libs/decorators';

export type Action = ActionType<typeof actions>;

export interface State {
    readonly graph: Graph | null;
    readonly guards: ReadonlyArray<number> | null;
    readonly shift: Shift | null;
    readonly rules: "one" | "all";
}

const initialState: State = {
    graph: null,
    guards: null,
    shift: null,
    rules: "all"
}

const getArena = memoize((graph: Graph, rules: "one" | "all") => {
    let arena: EDSArena | null;
    let i = 1;
    while (!(arena = EDSArena.computeArena(graph, i, rules)) || !arena.startingConf())
        i++;
    return arena;
});

export default function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case getType(actions.selectVertex): {
            const { graph, guards, rules } = state;
            const v = action.payload;
            if (!guards || guards.includes(v))
                return state;
            const arena = getArena(graph, rules);
            const res = arena.guardsAnswer(graph, guards, v);
            if (!res)
                return state;
            const { conf, shift } = res;
            return { ...state, guards: conf, shift };
        }
        case getType(actions.submitInput): {
            const { type, input, rules } = action.payload;
            let graph;
            if (type === "load") {
                const textdata = localStorage.getItem("graph-" + input);
                if (!textdata)
                    return state;
                const data: any = JSON.parse(textdata);
                const code = data.code;
                const result2 = parse(code);
                if (result2 instanceof Graph) {
                    graph = result2;
                } else
                    return state;
            } else { //case "generate":
                const result = parse(input);
                if (result instanceof Graph) {
                    graph = result;
                } else
                    return state;
            }
            const arena = getArena(graph, rules);
            const guards = arena.startingConf();
            const gstate = guards ? { guards } : {}
            return { ...state, graph, rules, guards, ...gstate }
        }
        default:
            return state;
    }
}