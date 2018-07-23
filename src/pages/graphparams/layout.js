import {chain, filter, map, range, times} from '@fp';
import * as d3 from 'd3-force';

const edges = graph =>
    filter(
        ({from, to}) => from < to,
        chain(
            i => map(
                j => ({from: i, to: j}),
                graph.adj[i]
            ),
            range(0, graph.V)
        )
    );

const getLayout = graph => {
    const nodes = times(i => ({id: i}), graph.V);
    const links = map(({from, to}) => ({source: from, target: to}), edges(graph));
    const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody())
        .force('link', d3.forceLink(links))
        .force("center", d3.forceCenter(0, 0))
        //.force('collision', d3.forceCollide(100))
        .stop();
    for (let i = 0; i < 1000; i++)
        simulation.tick();

    const lx = map(v => v.x, nodes);
    const ly = map(v => v.y, nodes);
    const minx = Math.min(...lx);
    const miny = Math.min(...ly);
    const dx = Math.max(...lx) - minx;
    const dy = Math.max(...ly) - miny;
    return map(v => ({x: (v.x - minx) / dx, y: (v.y - miny) / dy}), nodes); 
};

export default getLayout;