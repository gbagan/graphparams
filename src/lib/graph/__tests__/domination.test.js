import { any, all, range } from '@fp';
import { isConnected } from '../basic';
import { connectedDominatingSet, dominatingSet, independentDominatingSet, totalDominatingSet } from '../domination';
import { graph, hasEdge } from '../graph';
import { petersen } from '../generate';
import { addCycle, addPath, inducedGraph } from '../operators';

const test = (fn, checkFn) => (graph, value) => () => {
    const dom = fn(graph);
    expect(dom.result).toBe(value);
    if (value === Infinity) {
        expect(dom.witness).toBe(null);
    } else {
        expect(checkFn(graph, dom.witness)).toBe(true);
        expect(dom.witness.length).toBe(value);
    }
};

const isDominating = (graph, dom) =>
    !!dom && all(i => any(j => dom.includes(j), graph[i].concat(i)), range(0, graph.length));

const isTotalDominating = (graph, dom) =>
    !!dom && all(i => any(j => dom.includes(j), graph[i]), range(0, graph.length));

const isIndependentDominating = (graph, dom) =>
    !!dom && isDominating(graph, dom) && all(i => all(j => i === j || !hasEdge(graph, i, j), dom), dom);

const isConnectedDominating = (graph, dom) =>
    !!dom && isDominating(graph, dom) && isConnected(inducedGraph(dom, graph));

const testDom = test(dominatingSet, isDominating);
const testTotal = test(totalDominatingSet, isTotalDominating);
const testInd = test(independentDominatingSet, isIndependentDominating);
const testConnected = test(connectedDominatingSet, isConnectedDominating);

it('dominatingSet(I6)', testDom(graph(6), 6));
it('dominatingSet(C6)', testDom(addCycle([0, 4, 2, 1, 3, 5], graph(6)), 2));
it('dominatingSet(petersen)', testDom(petersen(), 3));

it('totalDominatingSet(C5 + I1)', testTotal(graph(6) |> addCycle([0, 3, 1, 2, 5]), Infinity));
it('totalDominatingSet(C6)', testTotal(graph(6) |> addCycle([0, 4, 2, 1, 3, 5]), 4));
it('totalDominatingSet(petersen)', testTotal(petersen(), 4));

it('independentDominatingSet(I6)', testInd(graph(6), 6));
it('indepdendentDominatingSet(petersen)', testInd(graph(6) |> addPath([0, 2, 3, 4]) |> addPath([1, 2, 3, 5]), 3));
it('indepdendentDominatingSet(petersen)', testInd(petersen(), 3));

it('connectedDominatingSet(C5 + I1)', testConnected(addCycle([0, 3, 1, 2, 5], graph(6)), Infinity));
it('connectedDominatingSet(C7)', testConnected(addCycle([0, 4, 2, 1, 3, 6, 5], graph(7)), 5));
it('connectedDominatingSet(petersen)', testConnected(petersen(), 4));
