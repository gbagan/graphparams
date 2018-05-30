import * as React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import * as vis from 'vis';
import Card from 'antd/lib/card';

import { range } from "../../libs/iter";
import selector from '../redux/selector';
import { edges } from "../../libs/graph/graph";
import VisGraph from "../../libs/components/VisGraph"

const colors = ['red', 'blue', 'green', 'cyan', 'magenta', 'orange', 'gray', 'black', 'yellow']

const edgeId = (u: number, v: number) => u < v ? (u.toString() + "," + v.toString()) : (v.toString() + "," + u.toString());

const mapStateToProps = createSelector(selector, state => ({
    graph: state.graph,
    witness: state.witness
}));

const mapDispatchToProps = {}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

const GraphOutput: React.SFC<Props> = (props) => {
    const { graph, witness } = props;
    if (!graph)
        return <Card className="viz" title="Graph" />;

    const visnodes: vis.Node[] = [...range(graph.V)].map(i => {
        let color: string;
        if (!witness)
            color = 'blue';
        else if (["chromatic", "domcol", "totaldomcol", "domedcol"].includes(witness.name))
            color = colors[witness.witness[i]] || 'blue';
        else if (witness.witness.includes(i))
            color = 'red';
        else
            color = 'blue';
        return {
            id: i.toString(),
            color: { background: color }
        }
    });

    let selectedEdges: string[];
    if (!witness)
        selectedEdges = [];
    else if (witness.name == "matching")
        selectedEdges = [...range(witness.witness.length / 2)].map(i =>
            edgeId(witness.witness[2 * i], witness.witness[2 * i + 1]));
    else if (witness.name == "diameter")
        selectedEdges = [...range(witness.witness.length - 1)].map(i =>
            edgeId(witness.witness[i], witness.witness[i + 1]));
    else if (witness.name === "hamilton" || witness.name === "girth" || (witness.name === "chordal"))
        selectedEdges = [...range(witness.witness.length)].map(i =>
            edgeId(witness.witness[i], witness.witness[i === witness.witness.length - 1 ? 0 : i + 1]));
    else
        selectedEdges = [];

    const visedges: vis.EdgeOptions[] = [...edges(graph)].map(edge => {
        const id = edgeId(edge[0], edge[1]);
        return { id, from: edge[0], to: edge[1],
            color: selectedEdges.includes(id) ? 
                { color: 'red', inherit: false } : { color: 'blue', inherit: false },
            width: selectedEdges.includes(id) ? 3 : 1
        }

    });

    return (
        <Card className="viz" title="Graph">
            <VisGraph nodes={visnodes} edges={visedges} options={options} />
        </Card>
    )
}

const options = {
    physics: {
        enabled: false
    },
    edges: {
        smooth: false
    },
    layout: {
        randomSeed: undefined,
        improvedLayout:true,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GraphOutput)