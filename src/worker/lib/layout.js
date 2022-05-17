import {max, min, times} from '@fp';
import {edges} from '@/lib/graph/graph';
import * as d3 from 'd3-force';

const getLayout = graph => {
    const nodes = times(i => ({id: i}), graph.length);
    const links = edges(graph).map(([source, target]) => ({source, target}));
    const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody())
        .force('link', d3.forceLink(links))
        .force('center', d3.forceCenter(0, 0))
        .stop();
    for (let i = 0; i < 1000; i++)
        simulation.tick();

    const lx = nodes.map(v => v.x);
    const ly = nodes.map(v => v.y);
    const minx = min(lx);
    const miny = min(ly);
    const dx = max(lx) - minx;
    const dy = max(ly) - miny;
    return nodes.map(v => ({x: (v.x - minx) / dx, y: (v.y - miny) / dy})); 
}

export default getLayout;