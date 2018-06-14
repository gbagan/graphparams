import {identifyingCode /*, locatingDominatingSet */ } from "../idcode";

import {clique, graph, path} from "../generate";
import Graph from "../graph";
import {join} from "../operators";

const testIdCode = (g: Graph, expectedRes: number) => {
    expect(identifyingCode(g).result).toBe(expectedRes);
};

it("identifyingCode(K5)", () => testIdCode(clique(5), Infinity));
it("identifyingCode(K5)", () => testIdCode(join(graph(2), path(4)), Infinity));
