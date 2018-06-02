import * as React from "react";

import { Solution } from "../types";

type Props = {
    index: number,
    solution: Solution,
    onSelect: (solution: Solution | null) => void;
};

class OutputSolution extends React.Component<Props> {
    public render() {
        return (
            <a href="#" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
                solution {this.props.index + 1}
            </a>
        );
    }

    private handleMouseOver = () => this.props.onSelect(this.props.solution);
    private handleMouseOut = () => this.props.onSelect(null);
}

export default OutputSolution;
