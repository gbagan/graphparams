import {map, max, min, times} from '@fp';
import {edges} from '@/lib/graph/graph';
import * as d3 from 'd3-force';

const getLayout = graph => {
    const nodes = times(i => ({id: i}), graph.length);
    const links = map(([source, target]) => ({source, target}), edges(graph));
    const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody())
        .force('link', d3.forceLink(links))
        .force('center', d3.forceCenter(0, 0))
        .stop();
    for (let i = 0; i < 1000; i++)
        simulation.tick();

    const lx = map(v => v.x, nodes);
    const ly = map(v => v.y, nodes);
    const minx = min(lx);
    const miny = min(ly);
    const dx = max(lx) - minx;
    const dy = max(ly) - miny;
    return map(v => ({x: (v.x - minx) / dx, y: (v.y - miny) / dy}), nodes); 
}

export default getLayout;