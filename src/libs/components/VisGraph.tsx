import * as React from 'react';
import * as vis from 'vis';

import { isEqual } from '../../libs/iter';

interface Props {
    readonly nodes: ReadonlyArray<vis.Node> | null;
    readonly edges: ReadonlyArray<vis.EdgeOptions> | null;
    readonly options?: vis.Options;
    readonly events?: Events
    readonly className?: string;
}

// todo key: vis.NetworkEvents
type Events = { [key: string]: (params: any) => void }


interface State { }

export default class VisGraph extends React.Component<Props, State> {
    network: vis.Network | null;
    nodes: vis.DataSet<vis.Node> | null;
    edges: vis.DataSet<vis.EdgeOptions> | null;
    ref: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);
        this.state = {};

        this.ref = React.createRef();
        this.network = null;
        this.nodes = null;
        this.edges = null;
    }

    componentDidMount() {
        this.hardUpdate();
    }

    componentDidUpdate() {
        this.hardUpdate();
    }

    shouldComponentUpdate(nextProps: Props) {
        if (!this.network || !this.nodes || !this.edges)
            return true;

        let { nodes, edges, options, events } = nextProps;
        nodes = nodes || [];
        edges = edges || [];
        events = events || {};
        options = options || {};

        if (!isEqual((nodes).map(v => v.id).sort(), (this.props.nodes || []).map(v => v.id).sort()))
            return true;

        if (!isEqual((edges).map(v => v.id).sort(), (this.props.edges || []).map(v => v.id).sort()))
            return true;

        this.nodes.update(nodes.slice());
        this.edges.update(edges);

        if (this.props.options !== options) {
            this.network.setOptions(options);
        }

        if (this.props.events !== events) {
            for (const [name, callback] of Object.entries(this.props.events || {})) {
                this.network.off(name as vis.NetworkEvents, callback);
            }
            for (const [name, callback] of Object.entries(events)) {
                this.network.on(name as vis.NetworkEvents, callback);
            }
        }

        return false;
    }

    hardUpdate() {
        const { nodes, edges, options, events } = this.props;
        if (this.network)
            this.network.destroy();
        this.network = null;
        this.edges = null;
        this.nodes = null;
        if (nodes && edges) {
            this.edges = new vis.DataSet(edges.slice());
            this.nodes = new vis.DataSet(nodes.slice());
            const data = {
                nodes: this.nodes,
                edges: this.edges,
            }
            this.network = new vis.Network(this.ref.current!, data, options);
            for (const [name, callback] of Object.entries(events || {})) {
                this.network.on(name as vis.NetworkEvents, callback);
            }
        }
    }

    componentWillunount() {
        if (this.network !== null)
            this.network.destroy();
        this.network = null;
        this.edges = null;
        this.nodes = null;
    }

    render() {
        return (
            <div className={this.props.className} style={divStyle} ref={this.ref} />
        );
    }
}

const divStyle = {
    width: '100%',
    height: '100%'
}