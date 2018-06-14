import * as React from "react";
import * as vis from "vis";

import VisGraph from "./VisGraph";

export type EdgeTraffic = {
    readonly id: string;
    readonly size: number,
    readonly isBackward?: boolean
};

// todo key: vis.NetworkEvents
type Events = { [key: string]: (params: any) => void };

type Props = {
    readonly nodes: ReadonlyArray<vis.Node> | null;
    readonly edges: ReadonlyArray<vis.EdgeOptions> | null;
    readonly options?: vis.Options;
    readonly events?: Events
    readonly className?: string;
};

export default class VisWithTraffic extends React.Component<Props> {
    private trafficRef: React.RefObject<HTMLCanvasElement>;
    private visRef: React.RefObject<VisGraph>;

    constructor(props: Props) {
        super(props);
        this.trafficRef = React.createRef();
        this.visRef = React.createRef();
    }

    public componentDidMount() {
        this.trafficUpdate();
    }

    public componentDidUpdate() {
        this.trafficUpdate();
    }

    public animateTraffic = (edgesList: EdgeTraffic[]) => this.animateTrafficFrame(edgesList, 0.1);

    public render() {
        const { nodes, edges, options, events, className } = this.props;

        return (
            <div className={className} style={divStyle}>
                <VisGraph ref={this.visRef} nodes={nodes} edges={edges} options={options} events={events} />
                <div>
                    <canvas ref={this.trafficRef} className="networkTrafficCanvas" style={canvasStyle} />
                </div>
            </div>
        );
    }

    private trafficUpdate() {
        if (!this.visRef.current || !this.visRef.current.network || !this.visRef.current.ref.current) {
            return;
        }
        const network = this.visRef.current.network;
        const visGraph = this.visRef.current;
        const frame = visGraph.ref.current;
        if (!frame)
            return

        const visCanvas = frame.getElementsByTagName("canvas")[0];
        const canvas = this.trafficRef.current;
        if (!canvas || !(visCanvas instanceof HTMLCanvasElement))
            return

        canvas.width = visCanvas.width;
        canvas.height = visCanvas.height;

        const context = canvas.getContext("2d");
        if (!context)
            return

        const s = network.getScale();
        const t = (network as any).body.view.translation;

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.translate(t.x, t.y);
        context.scale(s, s);
    }

    private animateTrafficFrame(edgesList: EdgeTraffic[], offset: number) {
        if (!this.visRef.current || !this.visRef.current.network || !this.trafficRef.current) {
            return;
        }
        const network = this.visRef.current.network;
        const canvas = this.trafficRef.current;
        const context = canvas.getContext("2d");
        if (!context)
            return

        const maxOffset = .9;

        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();

        if (offset > maxOffset)
            return

        for (const edgeTraffic of edgesList) {
            const nedge = (network as any).body.edges[edgeTraffic.id];
            if (!nedge)
                continue

            const p: vis.Position = nedge.edgeType.getPoint(edgeTraffic.isBackward ? maxOffset - offset : offset);

            context.beginPath();
            context.arc(p.x, p.y, edgeTraffic.size || 1, 0, Math.PI * 2, false);
            context.lineWidth = 1;
            context.strokeStyle = "#000";
            context.fillStyle = "red";
            context.fill();
            context.stroke();
            context.closePath();
        }

        setTimeout(() => this.animateTrafficFrame(edgesList, offset + 0.01), 10);
    }
}

const divStyle = { position: "relative" } as any; ////

const canvasStyle = { ///
    height: "100%",
    left: "0",
    pointerEvents: "none",
    position: "absolute",
    top: "0",
    width: "100%",
    zIndex: "1",
} as any;    // any  because position is not a valid cssproperties
