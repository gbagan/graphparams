import {range} from '@fp';
import {reduceWhile} from 'ramda';
import {handleActions} from '@/commonreact';

import actions from './actions';

import {makeEDS, startingConf, guardsAnswer} from '@/lib/arena/edsarena';
import {memoize} from '@/lib/decorators';
import parse from '@/lib/graph/parser';
import getLayout from '@/lib/layout';

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

const reducer = handleActions({
    [actions.selectVertex]: (state, vertex) => {
        const {graph, guards, rules} = state;
        if (!graph || !guards || guards.includes(vertex))
            return state;
        const eds = getEDS(graph, rules);
        const guards2 = guardsAnswer(eds, guards, vertex);
        if (!guards2)
            return state;
        return { ...state, guards: guards2 };
    },
    [actions.submitInput]: (state, {type, input, rules}) => {
        let graph;
        if (type === 'load') {
            const textdata = localStorage.getItem('graph-' + input);
            if (!textdata) {
                return state;
            }
            const data = JSON.parse(textdata);
            const code = data.code;
            const result = parse(code);
            if (typeof result !== 'string') {
                graph = result;
            } else {
                return state;
            }
        } else { // type === "generate":
            const result = parse(input);
            if (typeof result !== 'string') {
                graph = result;
            } else {
                return state;
            }
        }
        const layout = getLayout(graph);
        const eds = getEDS(graph, rules);
        const guards = startingConf(eds);
        return { ...state, layout, graph, rules, guards };
    }
}, initialState);

export default reducer;