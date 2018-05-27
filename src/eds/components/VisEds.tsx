import * as React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import * as vis from 'vis';

import * as iter from "../../libs/iter";
import { Shift } from "../types";
import selector from '../redux/selector';
import * as actions from "../redux/actions";

//import POLICEMAN  "../img/policeman.png";
//import HOUSE from "../img/house.png"
const POLICEMAN = "static/policeman.png";
const HOUSE = "static/house.png";

import VisWithTraffic, { EdgeTraffic } from "../../libs/components/VisWithTraffic"


const mapStateToProps = createSelector(selector, state => ({
    graph: state.graph,
    guards: state.guards,
    shift: state.shift
}));

const mapDispatchToProps = {
    onSelectVertex: actions.selectVertex
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

class VisEds extends React.Component<Props, {}> {
    animateTraffic: ((e: EdgeTraffic[]) => void) | null

    constructor(props: Props) {
        super(props);
        this.animateTraffic = null;
    }

    componentDidUpdate(prevProps: Props, prevState: {}) {
        const prevGuards = prevProps.guards;
        const nextGuards = this.props.guards;
        const { shift, graph } = this.props;
        if (!prevGuards || !nextGuards || !graph || prevProps.graph !== graph || !shift)
            return null;
        const traffic = edgeTraffic(shift);
        if (this.animateTraffic && traffic)
            this.animateTraffic(traffic);
        return null;
    }


    render() {
        const { graph, guards, onSelectVertex } = this.props;
        if (!graph)
            return <div className="viz" />;
        //const digraph = (graph as any).reverseAdj !== undefined;

        const nodes: vis.Node[] = Array.from(iter.map(iter.range(0, graph.V), i => ({
            id: i.toString(),
            shape: 'circularImage',
            image: (guards || []).includes(i) ? POLICEMAN : HOUSE
        })));

        const edges: vis.EdgeOptions[] = Array.from(graph.edges()).map(edge =>
            ({ id: edge[0] + "," + edge[1], from: edge[0], to: edge[1] })
        )

        const events = {
            'click': (params: any) => onSelectVertex && params.nodes.length === 1 && onSelectVertex(parseInt(params.nodes[0]))
        }

        return <VisWithTraffic className="viz" nodes={nodes} edges={edges} options={options} events={events}
            ref={component => { if (component) this.animateTraffic = component.animateTraffic }} />
    }
}
//if (digraph)
//            edge.arrows = 'to';



const options = {
    interaction: {
        selectConnectedEdges: false,
    },
    physics: {
        enabled: false
    },
    nodes: {
        color: {
            background: 'blue',
        }
    },
    edges: {
        color: {
            highlight: 'red'
        },
        smooth: false
    }
}


function edgeId(u: number, v: number, isDigraph: boolean) {
    return isDigraph || u < v ?
        u.toString() + "," + v.toString() 
        : v.toString() + "," + u.toString();
}


function edgeTraffic(shift: Shift) {
    const isDigraph = false;

    return shift.map(pair => ({
        id: edgeId(pair[0], pair[1], isDigraph),
        size: 5,
        isBackward: !isDigraph && pair[0] > pair[1]
    }))
}

export default connect(mapStateToProps, mapDispatchToProps)(VisEds)