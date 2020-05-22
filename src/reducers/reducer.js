import {map} from '@fp';
import {handleActions} from '@/commonreact';

import actions from './actions';
import getLayout from '@/lib/layout';

import {CODE_EXAMPLE} from '../data';

const GRAPH_PARAMETERS = [
    { cat: 1, hardness: 0, name: 'order', fullname: 'order' },
    { cat: 1, hardness: 0, name: 'nbedges', fullname: 'number of edges' },
    { cat: 1, hardness: 0, name: 'mindegree', fullname: 'minimun degree' },
    { cat: 1, hardness: 0, name: 'maxdegree', fullname: 'maximum degree' },
    { cat: 1, hardness: 0, name: 'degen', fullname: 'degeneracy' },
    { cat: 1, hardness: 0, name: 'diameter', fullname: 'diameter' },
    { cat: 1, hardness: 0, name: 'girth', fullname: 'girth' },
    { cat: 1, hardness: 0, name: 'matching', fullname: 'maximum matching' },
    { cat: 1, hardness: 2, name: 'tw', fullname: 'treewidth' },

    { cat: 2, hardness: 0, name: 'regular', fullname: 'regular' },
    { cat: 2, hardness: 0, name: 'connected', fullname: 'connected' },
    { cat: 2, hardness: 1, name: 'hamilton', fullname: 'hamiltonian' },
    { cat: 2, hardness: 0, name: 'chordal', fullname: 'chordal' },

    { cat: 3, hardness: 1, name: 'mis', fullname: 'independent set' },
    { cat: 3, hardness: 1, name: 'clique', fullname: 'clique' },
    { cat: 3, hardness: 1, name: 'chromatic', fullname: 'chromatic number' },
    { cat: 3, hardness: 2, name: 'domcol', fullname: 'dominator coloring' },
    { cat: 3, hardness: 2, name: 'totaldomcol', fullname: 'total dominator coloring' },
    { cat: 3, hardness: 2, name: 'domedcol', fullname: 'dominated coloring' },
    { cat: 4, hardness: 1, name: 'dom', fullname: 'dominating set' },
    { cat: 4, hardness: 1, name: 'totaldom', fullname: 'total dominating set' },
    { cat: 4, hardness: 1, name: 'inddom', fullname: 'independent dominating set' },
    { cat: 4, hardness: 2, name: 'cdom', fullname: 'connected dominating set' },
    { cat: 4, hardness: 1, name: 'idcode', fullname: 'identifying code' },
    { cat: 4, hardness: 1, name: 'locdom', fullname: 'locating dominating set' },
    { cat: 4, hardness: 2, name: 'edn', fullname: 'eternal dominating set' },
    { cat: 4, hardness: 2, name: 'medn', fullname: 'm-eternal dominating set' },
];

export const initialState = {
    code: CODE_EXAMPLE,
    computing: false,
    error: null,
    graph: null,
    parameters: map(param => ({...param, checked: param.hardness <= 1, result: null}), GRAPH_PARAMETERS),
    witness: null,
    layout: null,
};

const reducer = handleActions({
    [actions.changeCode]: (state, code) => ({...state, code}),
    [actions.toggleParameter]: (state, name) => ({
        ...state,
        parameters: map(
            p => p.name === name ?  { ...p, checked: !p.checked } : p,
            state.parameters
        )
    }),
    [actions.selectAll]: state => ({
        ...state,
        parameters: map(p => ({ ...p, checked: true }), state.parameters)
    }),
    [actions.unselectAll]: state => ({
        ...state,
        parameters: map(p => ({ ...p, checked: false }), state.parameters)
    }),
    [actions.startComputing]: state => ({
        ...state,
        parameters: map(p => ({ ...p, result: null }), state.parameters),
        computing: true,
        graph: null,
        layout: null,
        error: null, 
        witness: null
    }),
    [actions.finishComputing]: state => ({...state, computing: false}),
    [actions.graphComputed]: (state, graph) => ({...state, graph, layout: getLayout(graph)}),
    [actions.computeGraphError]: (state, error) => ({...state, error}),
    [actions.startComputingParameter]: (state, name) => ({
        ...state,
        parameters: map(
            p => p.name === name ? { ...p, result: 'computing' } : p,
            state.parameters
        )
    }),
    [actions.parameterComputed]: (state, parameter) => ({
        ...state,
        parameters: map(p => p.name === parameter.name ? parameter : p, state.parameters)
    }),
    [actions.showWitness]: (state, parameter) => {
        if (!parameter)
            return { ...state, witness: null }
        else if (!parameter.result || typeof parameter.result === 'string' || !parameter.result.witness)
            return state;
        else
            return { ...state, witness: {name: parameter.name, witness: parameter.result.witness }};
    }
});

export default reducer;