import {graph} from '../graph';
import {biclique, clique, cycle, path, sun} from '../generate';
import treewidth from '../treewidth';

const testTw = (g, expectedRes) => {
    expect(treewidth(g)).toBe(expectedRes);
};

it('treewidth(I6)', () => testTw(graph(6), 0));
it('treewidth(P6)', () => testTw(path(6), 1));
it('treewidth(C6)', () => testTw(cycle(6), 2));
it('treewidth(K3,3)', () => testTw(biclique(3, 3), 3));
it('treewidth(K6)',  () => testTw(clique(6), 5));
it('treewidth(sun3)', () => testTw(sun(3), 2));
it('treewidth(sun4)', () => testTw(sun(4), 3));
