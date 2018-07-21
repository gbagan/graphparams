import { range } from 'ramda';
import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import * as actions from '../redux/actions';
import selector from '../redux/selector';

// import VisWithTraffic, { EdgeTraffic } from "@/lib/components/VisWithTraffic";

import POLICEMAN from '../img/policeman.svg';
import HOUSE from '../img/house.svg';

const positions = [{ x: 150, y: 150 }, { x: 500, y: 50 }, { x: 850, y: 150 }, { x: 950, y: 500 }];

const VisEds = ({ graph, className }) => (
    <svg viewBox="0 0 1000 1000" className={className}>
        <defs>
            <pattern id="policeman" x="0" y="0" height="100%" width="100%">
                <image x="0" y="0" width="50" height="50" href={POLICEMAN} />
            </pattern>
            <pattern id="house" x="0" y="0" height="100%" width="100%">
                <image x="0" y="0" width="75" height="75" href={HOUSE} />
            </pattern>
        </defs>
        {
            graph && [...graph.edges()].map(([v1, v2]) =>
                <line
                    x1={positions[v1].x}
                    y1={positions[v1].y}
                    x2={positions[v2].x}
                    y2={positions[v2].y}
                    stroke="blue"
                    stroke-width="6" 
                />
            )
        }
        {
            graph && range(0, graph.V).map(i =>
                <image
                    x={positions[i].x-45}
                    y={positions[i].y-45}
                    width={90}
                    height={90}
                    href={HOUSE}
                />
            )
        }
    </svg>
);

/*
const { className, graph, guards, onSelectVertex } = this.props;
if (!graph) {
    return <div className={className} />;
}
// const digraph = (graph as any).reverseAdj !== undefined;

const nodes = range(0, graph.V).map(i => ({
    id: i.toString(),
    image: (guards || []).includes(i) ? POLICEMAN : HOUSE,
    shape: 'circularImage',
}));

const edges = [...graph.edges()].map(edge =>
    ({ id: edge[0] + "," + edge[1], from: edge[0], to: edge[1] }));

const events = {
    click: params => params.nodes.length === 1 && onSelectVertex(parseInt(params.nodes[0], 10)),
};

return (
    <VisWithTraffic
        className={className}
        nodes={nodes}
        edges={edges}
        options={options}
        events={events}
        ref={component => { if (component) { this.animateTraffic = component.animateTraffic; }}}
    />
);
}

componentDidUpdate (prevProps) {
const prevGuards = prevProps.guards;
const nextGuards = this.props.guards;
const {shift, graph} = this.props;
if (!prevGuards || !nextGuards || !graph || prevProps.graph !== graph || !shift) {
    return null;
}
const traffic = edgeTraffic(shift);
if (this.animateTraffic && traffic) {
    this.animateTraffic(traffic);
}
return null;
}

}
// if (digraph)
//            edge.arrows = 'to';

const edgeId = (u, v, isDigraph) =>
isDigraph || u < v
? u.toString() + ',' + v.toString()
: v.toString() + ',' + u.toString();

const edgeTraffic = shift => {
const isDigraph = false;
return shift.map(({from, to}) => ({
id: edgeId(from, to, isDigraph),
isBackward: !isDigraph && from > to,
size: 5,
}));
}
*/

const mapStateToProps = createSelector(selector, ({ graph, guards, shift }) => (
    { graph, guards, shift }
));

const mapDispatchToProps = {
    onSelectVertex: actions.selectVertex,
};

export default connect(mapStateToProps, mapDispatchToProps)(VisEds);