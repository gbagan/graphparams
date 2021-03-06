import {identifyingCode /*, locatingDominatingSet */ } from '../idcode';
import {graph} from '../graph';
import {clique, path} from '../generate';
import {join} from '../operators';

const testIdCode = (g, expectedRes) => {
    expect(identifyingCode(g).result).toBe(expectedRes);
};

it('identifyingCode(K5)', () => testIdCode(clique(5), Infinity));
it('identifyingCode(I2 join P4)', () => testIdCode(join(graph(2), path(4)), 5));
it('identifyingCode(P2 join P4)', () => testIdCode(join(path(2), path(4)), Infinity));
