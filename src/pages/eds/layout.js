import {range} from '@fp';
import * as d3 from 'd3-force';

const getLayout = graph => {
    const nodes = range(0, graph.V).map(i => ({id: i}));
    const links = [...graph.edges()].map(([x, y]) => ({source: x, target: y}));

    const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody())
        .force('link', d3.forceLink(links))
        .force("center", d3.forceCenter(0, 0))
        .force('collision', d3.forceCollide(100))
        .stop();
    for (let i = 0; i < 1000; i++)
        simulation.tick();

    const lx = nodes.map(v => v.x);
    const ly = nodes.map(v => v.y);
    const minx = Math.min(...lx);
    const miny = Math.min(...ly);
    const dx = Math.max(...lx) - minx;
    const dy = Math.max(...ly) - miny;
    return nodes.map(v => ({ x: (v.x - minx) / dx, y: (v.y - miny) / dy  })); 
};

export default getLayout;