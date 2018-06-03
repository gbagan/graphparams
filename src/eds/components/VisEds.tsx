import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import * as vis from "vis";

import * as iter from "../../lib/iter";
import * as actions from "../redux/actions";
import selector from "../redux/selector";
import { Shift } from "../types";

import VisWithTraffic, { EdgeTraffic } from "../../lib/components/VisWithTraffic";

// import POLICEMAN  "../img/policeman.png";
// import HOUSE from "../img/house.png"
const POLICEMAN = "static/policeman.png";
const HOUSE = "static/house.png";

const mapStateToProps = createSelector(selector, state => ({
    graph: state.graph,
    guards: state.guards,
    shift: state.shift,
}));

const mapDispatchToProps = {
    onSelectVertex: actions.selectVertex,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

class VisEds extends React.Component<Props> {
    private animateTraffic: ((e: EdgeTraffic[]) => void) | null;

    constructor(props: Props) {
        super(props);
        this.animateTraffic = null;
    }

    public render() {
        const { graph, guards, onSelectVertex } = this.props;
        if (!graph) {
            return <div className="viz" />;
        }
        // const digraph = (graph as any).reverseAdj !== undefined;

        const nodes: vis.Node[] = [...iter.range(0, graph.V)].map(i => ({
            id: i.toString(),
            image: (guards || []).includes(i) ? POLICEMAN : HOUSE,
            shape: "circularImage",
        }));

        const edges: vis.EdgeOptions[] = [...graph.edges()].map(edge =>
            ({ id: edge[0] + "," + edge[1], from: edge[0], to: edge[1] }));

        const events = {
            click: (params: any) => params.nodes.length === 1 && onSelectVertex(parseInt(params.nodes[0], 10)),
        };

        return (
            <VisWithTraffic
                className="viz"
                nodes={nodes}
                edges={edges}
                options={options}
                events={events}
                ref={component => { if (component) { this.animateTraffic = component.animateTraffic; }}}
            />
        );
    }

    public componentDidUpdate(prevProps: Props) {
        const prevGuards = prevProps.guards;
        const nextGuards = this.props.guards;
        const { shift, graph } = this.props;
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

const options = {
    edges: {
        smooth: false,
    },
    interaction: {
        selectConnectedEdges: false,
    },
    nodes: {
        color: {
            background: "blue",
        },
    },
    physics: {
        enabled: false,
    },
};

function edgeId(u: number, v: number, isDigraph: boolean) {
    return isDigraph || u < v ?
        u.toString() + "," + v.toString()
        : v.toString() + "," + u.toString();
}

function edgeTraffic(shift: Shift) {
    const isDigraph = false;

    return shift.map(pair => ({
        id: edgeId(pair[0], pair[1], isDigraph),
        isBackward: !isDigraph && pair[0] > pair[1],
        size: 5,
    }));
}

export default connect(mapStateToProps, mapDispatchToProps)(VisEds);
