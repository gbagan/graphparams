import * as basic from './lib/graph/basic';
import isChordal from './lib/graph/chordal';
import * as coloring from './lib/graph/coloring';
import * as domination from './lib/graph/domination';
import * as idcode from './lib/graph/idcode';
import maximumMatching from './lib/graph/matching';
import treewidth from './lib/graph/treewidth';

const functions = {
    order: basic.nbVertices,
    nbedges: basic.nbEdges,
    mindegree: basic.minDegree,
    maxdegree: basic.maxDegree,
    degen: basic.degeneracy,
    diameter: basic.diameter,
    girth: basic.girth,
    matching: maximumMatching,
    tw: treewidth,

    regular: basic.isRegular,
    connected: basic.isConnected,
    hamilton: basic.isHamiltonian,
    chordal: isChordal,

    mis: basic.mis,
    clique: basic.cliqueNumber,
    chromatic: coloring.chromaticNumber,

    dom: domination.dominatingSet,
    totaldom: domination.totalDominatingSet,
    inddom: domination.independentDominatingSet,
    cdom: domination.connectedDominatingSet,
    idcode: idcode.identifyingCode,
    locdom: idcode.locatingDominatingSet,
    edn: eds.eds,
    medn: eds.meds
};

self.onmessage = msg => {
    action = msg.data;
    const graph = action.graph;
    const fn = functions.get(action.param.name);
    const result = fn(graph);
    const result2 = (typeof result === 'boolean' || typeof result === 'number')
            ? { result, witnesstype: "nowitness", witness: [] } : result;
    const result3 = result2.result === Infinity ? { result: -1, witness: result2.witness} : result2;
    self.postMessage ({ ...action.param, result: result3 });
}