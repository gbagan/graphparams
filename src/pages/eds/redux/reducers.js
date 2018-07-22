import {reduceWhile, range} from 'ramda';
import { ActionType, getType } from 'typesafe-actions';

import * as actions from "./actions";

import {makeEDS, startingConf, guardsAnswer} from '@/lib/arena/edsarena';
import {memoize} from '@/lib/decorators';
import Graph from '@/lib/graph/graph';
import parse from '@/lib/graph/parser';
import getLayout from '../layout';

/*
const GRAPH_EXAMPLE =
    `graph(9)
.addClique(0, 1, 2)
.addPath(2, 3, 4)
.addCycle(4, 5, 6, 7)
.addEdges(1-5, 4-8)
.addEdge(3, 8)`;
*/


const initialState = {
    graph: null,
    guards: null,
    rules: 'all',
    layout: null,
};


const getEDS = memoize((graph, rules) =>
    reduceWhile(
        eds => !startingConf(eds),
        (eds, i) =>  makeEDS(graph, i + 1, rules),
        makeEDS(graph, 1, rules),
        range(1, graph.V + 1)
    )
);

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case getType(actions.selectVertex): {
            const { graph, guards, rules } = state;
            const v = action.payload;
            if (!graph || !guards || guards.includes(v)) {
                return state;
            }
            const eds = getEDS(graph, rules);
            const guards2 = guardsAnswer(eds, guards, v);
            if (!guards2)
                return state;
            return { ...state, guards: guards2 };
        }
        case getType(actions.submitInput): {
            const { type, input, rules } = action.payload;
            let graph;
            if (type === 'load') {
                const textdata = localStorage.getItem('graph-' + input);
                if (!textdata) {
                    return state;
                }
                const data = JSON.parse(textdata);
                const code = data.code;
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
            const layout = getLayout(graph);
            const eds = getEDS(graph, rules);
            const guards = startingConf(eds);
            const gstate = guards ? {guards} : {};
            console.log(layout, graph);
            return { ...state, layout, graph, rules, guards, ...gstate };
        }
        default:
            return state;
    }
}

export default reducer;