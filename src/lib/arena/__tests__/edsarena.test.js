import {countBy, zipWith} from '@fp';
import {makeEDS, startingConf, guardsAnswer} from '../edsarena';
import {cycle, path, star, sun} from '../../graph/generate';

it('star(4), one guard rules, k=3', () => {
    const g = star(4);
    const eds = makeEDS(g, 3, 'one');
    const conf = startingConf(eds);
    expect(conf).toBeNull();
});

it('star(4), one guard rules, k=4', () => {
    const g = star(4);
    const eds = makeEDS(g, 4, 'one');
    const conf = startingConf(eds);
    expect(conf).not.toBeNull();
    expect(conf.length).toBe(4);
});

it('P3, all guards rules, k=1', () => {
    const g = path(3);
    const eds = makeEDS(g, 1, 'all');
    const conf = startingConf(eds);
    expect(conf).toBeNull();
});

it('C6, all guards rules, k=2', () => {
    const g = cycle(6);
    const eds = makeEDS(g, 2, 'all');
    const conf = startingConf(eds);
    expect(conf).not.toBeNull();
    expect(conf.length).toBe(2);
});

it('C7, all guards rules, k=2', () => {
    const g = cycle(9);
    const eds = makeEDS(g, 2, 'all');
    const conf = startingConf(eds);
    expect(conf).toBeNull();
});

it('sun(3), one guard rules, only one must guard moves', () => {
    const g = sun(3);
    const eds = makeEDS(g, 3, 'one');
    expect(eds).not.toBeNull();
    const guards = [0, 1, 2];
    const attack = 3;
    const answer = guardsAnswer(eds, guards, attack);
    expect(answer).not.toBeNull();
    expect(answer.length).toBe(guards.length);
    expect(answer.includes(attack));
    expect(countBy(x => x, zipWith((a, b) => a !== b, answer, guards))).toBe(1); 
});
