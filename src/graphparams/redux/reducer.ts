import { getType, ActionType, } from 'typesafe-actions';
import * as actions from './actions';
import '../custom.d.ts';
import {Witness, GraphParameter, PlainGraph} from "../types";

const GRAPH_PARAMETERS = [
    { cat: 1, hardness: 0, name: "order", fullname: "order", method: "nbVertices" },
    { cat: 1, hardness: 0, name: "nbedges", fullname: "number of edges", method: "nbEdges" },
    { cat: 1, hardness: 0, name: "mindegree", fullname: "minimun degree", method: "minDegree" },
    { cat: 1, hardness: 0, name: "maxdegree", fullname: "maximum degree", method: "maxDegree" },
    { cat: 1, hardness: 0, name: "degen", fullname: "degeneracy", method: "degeneracy" },
    { cat: 1, hardness: 0, name: "diameter", fullname: "diameter", method: "diameter" },
    { cat: 1, hardness: 0, name: "girth", fullname: "girth", method: "girth" },
    { cat: 1, hardness: 0, name: "matching", fullname: "maximum matching", method: "maximumMatching" },
    { cat: 1, hardness: 2, name: "tw", fullname: "treewidth", method: "treewidth" },

    { cat: 2, hardness: 0, name: "regular", fullname: "regular", method: "isRegular" },
    { cat: 2, hardness: 0, name: "connected", fullname: "connected", method: "isConnected" },
    { cat: 2, hardness: 1, name: "hamilton", fullname: "hamiltonian", method: "isHamiltonian" },
    { cat: 2, hardness: 0, name: "chordal", fullname: "chordal", method: "isChordal" },

    { cat: 3, hardness: 1, name: "mis", fullname: "independent set", method: "misOpt" },
    { cat: 3, hardness: 1, name: "clique", fullname: "clique", method: "cliqueNumberOpt" },
    { cat: 3, hardness: 1, name: "chromatic", fullname: "chromatic number", method: "chromaticNumber" },
    { cat: 3, hardness: 2, name: "domcol", fullname: "dominator coloring", method: "dominatorChromaticNumber" },
    { cat: 3, hardness: 2, name: "totaldomcol", fullname: "total dominator coloring", method: "totalDominatorChromaticNumber" },
    { cat: 3, hardness: 2, name: "domedcol", fullname: "dominated coloring", method: "dominatedChromaticNumber" },
    { cat: 4, hardness: 1, name: "dom", fullname: "dominating set", method: "dominationNumber" },
    { cat: 4, hardness: 1, name: "totaldom", fullname: "total dominating set", method: "totalDominationNumber" },
    { cat: 4, hardness: 1, name: "inddom", fullname: "independent dominating set", method: "independentDominatingSetOpt" },
    { cat: 4, hardness: 2, name: "cdom", fullname: "connected dominating set", method: "connectedDominationNumber" },
    //[4, 3, "idcode", "identifying code", "identifyingCode"],
    { cat: 4, hardness: 1, name: "idcode", fullname: "identifying code", method: "identifyingCodeOpt" },
    { cat: 4, hardness: 1, name: "locdom", fullname: "locating dominating set", method: "locatingDominatingSet" },
    { cat: 4, hardness: 2, name: "edn", fullname: "eternal dominating set", method: "edn" },
    { cat: 4, hardness: 2, name: "medn", fullname: "m-eternal dominating set", method: "medn" }
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
}

const initialState: State = {
    code: CODE_EXAMPLE,
    parameters: GRAPH_PARAMETERS.map(param => ({...param, checked: param.hardness <= 1, result: null})),
    helpText: HELP_TEXT,
    graph: null,
    error: null,
    computing: false,
    witness: null
}

export default function reducer(state: State = initialState, action: Action): State {
    switch(action.type) {
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
            return { ...state, error: action.payload }
        }
        case getType(actions.startComputingParameter): {
            const parameters = state.parameters.map<GraphParameter>(p => p.name === action.payload ? { ...p, result: "computing" } : p);
            return { ...state, parameters};
        }
        case getType(actions.parameterComputed): {
            const parameters = state.parameters.map(p => p.name === action.payload.name ? action.payload : p);
            return { ...state, parameters};
        }
        case getType(actions.showWitness): {
            return { ...state, witness: action.payload };
        }
        default:
            return state;
    }
    
} 