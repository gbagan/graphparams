import { ActionType, getType } from "typesafe-actions";

import "../custom.d.ts";
import {GraphParameter, PlainGraph, Witness} from "../types";
import * as actions from "./actions";

const GRAPH_PARAMETERS = [
    { cat: 1, hardness: 0, name: "order", fullname: "order" },
    { cat: 1, hardness: 0, name: "nbedges", fullname: "number of edges" },
    { cat: 1, hardness: 0, name: "mindegree", fullname: "minimun degree" },
    { cat: 1, hardness: 0, name: "maxdegree", fullname: "maximum degree" },
    { cat: 1, hardness: 0, name: "degen", fullname: "degeneracy" },
    { cat: 1, hardness: 0, name: "diameter", fullname: "diameter" },
    { cat: 1, hardness: 0, name: "girth", fullname: "girth" },
    { cat: 1, hardness: 0, name: "matching", fullname: "maximum matching" },
    { cat: 1, hardness: 2, name: "tw", fullname: "treewidth" },

    { cat: 2, hardness: 0, name: "regular", fullname: "regular" },
    { cat: 2, hardness: 0, name: "connected", fullname: "connected" },
    { cat: 2, hardness: 1, name: "hamilton", fullname: "hamiltonian" },
    { cat: 2, hardness: 0, name: "chordal", fullname: "chordal" },

    { cat: 3, hardness: 1, name: "mis", fullname: "independent set" },
    { cat: 3, hardness: 1, name: "clique", fullname: "clique" },
    { cat: 3, hardness: 1, name: "chromatic", fullname: "chromatic number" },
    { cat: 3, hardness: 2, name: "domcol", fullname: "dominator coloring" },
    { cat: 3, hardness: 2, name: "totaldomcol", fullname: "total dominator coloring" },
    { cat: 3, hardness: 2, name: "domedcol", fullname: "dominated coloring" },
    { cat: 4, hardness: 1, name: "dom", fullname: "dominating set" },
    { cat: 4, hardness: 1, name: "totaldom", fullname: "total dominating set" },
    { cat: 4, hardness: 1, name: "inddom", fullname: "independent dominating set" },
    { cat: 4, hardness: 2, name: "cdom", fullname: "connected dominating set" },
    { cat: 4, hardness: 1, name: "idcode", fullname: "identifying code" },
    { cat: 4, hardness: 1, name: "locdom", fullname: "locating dominating set" },
    { cat: 4, hardness: 2, name: "edn", fullname: "eternal dominating set" },
    { cat: 4, hardness: 2, name: "medn", fullname: "m-eternal dominating set" },
];

export const CODE_EXAMPLE = `graph(9)
.addClique(0, 1, 2)
.addPath(2, 3, 4)
.addCycle(4, 5, 6, 7)
.addEdges(1-5, 4-8)
.addEdge(3, 8)`;

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
function stringifyWitness(witness: any, name: string) {
    if (name == "matching") {
        let text = '';
        for (const [x, y] of witness as number[][]) {
            text += x + '-' + y + ','
        }
        return text.slice(0, text.length - 1);
    } else {
        return witness.toString();
    }
}*/
/*
let worker: GraphWorker|null = null;

function startWorker() {
    const worker = new GraphWorker();
    worker!.onmessage = (e) => null;
    return worker;
}
*/

export type Action = ActionType<typeof actions>;

export type State = {
    readonly code: string;
    readonly parameters: ReadonlyArray<GraphParameter>;
    readonly helpText: string;
    readonly error: string | null;
    readonly graph: PlainGraph | null;
    readonly computing: boolean;
    readonly witness: Witness | null
};

const initialState: State = {
    code: CODE_EXAMPLE,
    computing: false,
    error: null,
    graph: null,
    helpText: HELP_TEXT,
    parameters: GRAPH_PARAMETERS.map(param => ({...param, checked: param.hardness <= 1, result: null})),
    witness: null,
};

export default function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        case getType(actions.changeCode): {
            return {...state, code: action.payload};
        }
        case getType(actions.toggleParameter): {
            const parameters = state.parameters.map(p => p.name === action.payload
                                                    ?  { ...p, checked: !p.checked }  : p);
            return { ...state, parameters };
        }
        case getType(actions.selectAll): {
            const parameters = state.parameters.map(p => ({ ...p, checked: true }));
            return { ...state, parameters };
        }
        case getType(actions.unselectAll): {
            const parameters = state.parameters.map(p => ({ ...p, checked: false }));
            return { ...state, parameters };
        }
        case getType(actions.startComputing): {
            const parameters = state.parameters.map(p => ({ ...p, result: null }));
            return { ...state, parameters, computing: true, graph: null, error: null, witness: null};
        }
        case getType(actions.finishComputing): {
            return { ...state, computing: false};
        }
        case getType(actions.graphComputed): {
            return { ...state, graph: action.payload};
        }
        case getType(actions.computeGraphError): {
            return { ...state, error: action.payload };
        }
        case getType(actions.startComputingParameter): {
            const parameters = state.parameters.map<GraphParameter>(p =>
                p.name === action.payload ? { ...p, result: "computing" } : p);
            return { ...state, parameters};
        }
        case getType(actions.parameterComputed): {
            const parameters = state.parameters.map(p => p.name === action.payload.name ? action.payload : p);
            return { ...state, parameters};
        }
        case getType(actions.showWitness): {
            const parameter = action.payload;
            if (!parameter)
                return { ...state, witness: null }
            else if (!parameter.result || typeof parameter.result === "string" || !parameter.result.witness)
                return state;
            else
                return { ...state, witness: {name: parameter.name, witness: parameter.result.witness }};
        }
        default:
            return state;
    }
}
