import { every, range } from "../../iter";
import { isConnected } from "../basic";
import { connectedDominatingSet, dominatingSet, independentDominatingSet, totalDominatingSet } from "../domination";
import {graph, petersen} from "../generate";
import Graph from "../graph";
import { addCycle, addPath, inducedGraph } from "../operators";
import { Result } from "../types";

const test = (fn: (g: Graph) => Result, checkFn: (g: Graph, dom: ReadonlyArray<number> | null) => boolean) =>
    (g: Graph, value: number) => () => {
        const dom = fn(g);
        expect(dom.result).toBe(value);
        if (value === Infinity) {
            expect(dom.witness).toBe(null);
        } else {
            expect(checkFn(g, dom.witness)).toBe(true);
            expect(dom.witness!.length).toBe(value);
        }
    };

const isDominating = (g: Graph, dom: ReadonlyArray<number> | null) =>
    !!dom && every(range(g.V), i => g.adj[i].concat(i).some(j => dom.includes(j)));

const isTotalDominating = (g: Graph, dom: ReadonlyArray<number> | null) =>
    !!dom && every(range(g.V), i => g.adj[i].some(j => dom.includes(j)));

const isIndependentDominating = (g: Graph, dom: ReadonlyArray<number> | null) =>
    !!dom && isDominating(g, dom) && dom.every(i => dom.every(j => i === j || !g.hasEdge(i, j)));

const isConnectedDominating = (g: Graph, dom: ReadonlyArray<number> | null) =>
    !!dom && isDominating(g, dom) && isConnected(inducedGraph(g, dom));

const testDom = test(dominatingSet, isDominating);
const testTotal = test(totalDominatingSet, isTotalDominating);
const testInd = test(independentDominatingSet, isIndependentDominating);
const testConnected = test(connectedDominatingSet, isConnectedDominating);

it("dominatingSet(I6)", testDom(graph(6), 6));
it("dominatingSet(C6)", testDom(addCycle(graph(6), 0, 4, 2, 1, 3, 5), 2));
it("dominatingSet(petersen)", testDom(petersen(), 3));

it("totalDominatingSet(C5 + I1)", testTotal(addCycle(graph(6), 0, 3, 1, 2, 5), Infinity));
it("totalDominatingSet(C6)", testTotal(addCycle(graph(6), 0, 4, 2, 1, 3, 5), 4));
it("totalDominatingSet(petersen)", testTotal(petersen(), 4));

it("independentDominatingSet(I6)", testInd(graph(6), 6));
it("indepdendentDominatingSet(petersen)", testInd(addPath(addPath(graph(6), 0, 2, 3, 4), 1, 2, 3, 5), 3));
it("indepdendentDominatingSet(petersen)", testInd(petersen(), 3));

it("connectedDominatingSet(C5 + I1)", testConnected(addCycle(graph(6), 0, 3, 1, 2, 5), Infinity));
it("connectedDominatingSet(C7)", testConnected(addCycle(graph(7), 0, 4, 2, 1, 3, 6, 5), 5));
it("connectedDominatingSet(petersen)", testConnected(petersen(), 4));
