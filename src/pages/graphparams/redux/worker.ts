import register from "promise-worker/register";

import Graph, {fromPlainObject} from "@/lib/graph/graph";
import parse from "@/lib/graph/parser";
import { Result, WorkerAction } from "../types";

import * as basic from "@/lib/graph/basic";
import isChordal from "@/lib/graph/chordal";
import * as coloring from "@/lib/graph/coloring";
import * as domination from "@/lib/graph/domination";
import * as eds from "@/lib/graph/eds";
import * as idcode from "@/lib/graph/idcode";
import maximumMatching from "@/lib/graph/matching";
import treewidth from "@/lib/graph/treewidth";

const functions = new Map<string, (g: Graph) => boolean | number | Result>([
    ["order", basic.nbVertices],
    ["nbedges", basic.nbEdges],
    ["mindegree", basic.minDegree],
    ["maxdegree", basic.maxDegree],
    ["degen", basic.degeneracy],
    ["diameter", basic.diameter],
    ["girth", basic.girth],
    ["matching", maximumMatching],
    ["tw", treewidth],

    ["regular", basic.isRegular],
    ["connected", basic.isConnected],
    ["hamilton", basic.isHamiltonian],
    ["chordal", isChordal],

    ["mis", basic.mis],
    ["clique", basic.cliqueNumber],
    ["chromatic", coloring.chromaticNumber],
    ["domcol", coloring.dominatorColoring],
    ["totaldomcol", coloring.totalDominatorColoring],
    ["domedcol", coloring.dominatedColoring],

    ["dom",  domination.dominatingSet],
    ["totaldom", domination.totalDominatingSet],
    ["inddom", domination.independentDominatingSet],
    ["cdom", domination.connectedDominatingSet],
    ["idcode", idcode.identifyingCode],
    ["locdom", idcode.locatingDominatingSet],
    ["edn", eds.eds],
    ["medn", eds.meds],
]);

register((action: WorkerAction) => {
    if (action.type === "graph") {
        const result = parse(action.code);
        return typeof result === "string" ?
                                  { type: "error", error: result }
                                : { type: "graph", graph: result.toPlainObject() };
    } else if (action.type === "param") {
        const graph = fromPlainObject(action.graph);
        const fn = functions.get(action.param.name)!;
        const result = fn(graph);
        const result2 = (typeof result === "boolean" || typeof result === "number")
            ? { result, witness: null } : result;
        const result3 = result2.result === Infinity ? { result: -1, witness: result2.witness} : result2;
        return { ...action.param, result: result3 };
    }
    return null;
});
