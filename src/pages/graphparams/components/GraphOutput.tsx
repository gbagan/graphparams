import { connect, createSelector, React } from "@/commonreact";
import * as R from "ramda";

import * as vis from "vis";

import VisGraph from "@/lib/components/VisGraph";
import {selector} from "../redux";
import {PlainGraph} from "../types";

const colors = ["red", "blue", "green", "cyan", "magenta", "orange", "gray", "black", "yellow"];

const edgeId = (u: number, v: number) => u < v ?
    (u.toString() + "," + v.toString()) : (v.toString() + "," + u.toString());

const mapStateToProps = createSelector(selector,
    ({graph, witness}) => ({graph, witness})
);

const mapDispatchToProps = {};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & {className?: string};

function * edges(graph: PlainGraph) {
    for (let i = 0; i < graph.V; i++) {
        for (const j of graph.adj[i]) {
            if (i < j) {
                yield [i, j];
            }
        }
    }
}

const GraphOutput: React.SFC<Props> = ({graph, witness, className}) => {
    if (!graph) {
        return <div className={className}/>;
    }
    const visnodes: vis.Node[] = R.range(0, graph.V).map(i => {
        let color: string;
        if (!witness) {
            color = "blue";
        } else if (["chromatic", "domcol", "totaldomcol", "domedcol"].includes(witness.name)) {
            color = colors[witness.witness[i]] || "blue";
        } else if (witness.witness.includes(i)) {
            color = "red";
        } else {
            color = "blue";
        }
        return {
            color: { background: color },
            id: i.toString(),
        };
    });

    let selectedEdges: string[];
    if (!witness) {
        selectedEdges = [];
    } else if (witness.name === "matching") {
        selectedEdges = R.range(0, witness.witness.length / 2).map(i =>
            edgeId(witness.witness[2 * i], witness.witness[2 * i + 1]));
    } else if (witness.name === "diameter") {
        selectedEdges = R.range(0, witness.witness.length - 1).map(i =>
            edgeId(witness.witness[i], witness.witness[i + 1]));
    } else if (witness.name === "hamilton" || witness.name === "girth" || (witness.name === "chordal")) {
        selectedEdges = R.range(0, witness.witness.length).map(i =>
            edgeId(witness.witness[i], witness.witness[i === witness.witness.length - 1 ? 0 : i + 1]));
    } else {
        selectedEdges = [];
    }
    const visedges: vis.EdgeOptions[] = [...edges(graph)].map(edge => {
        const id = edgeId(edge[0], edge[1]);
        return {
            color: selectedEdges.includes(id) ?
                { color: "red", inherit: false } : { color: "blue", inherit: false },
            from: edge[0],
            id,
            to: edge[1],
            width: selectedEdges.includes(id) ? 3 : 1,
        };
    });

    return (
        <div className={className}>
            <VisGraph nodes={visnodes} edges={visedges} options={options} />
        </div>
    );
};

const options = {
    edges: {
        smooth: false,
    },
    layout: {
        improvedLayout: true,
        randomSeed: undefined,
    },
    physics: {
        enabled: false,
    },
};

export default connect(mapStateToProps, mapDispatchToProps)(GraphOutput);
