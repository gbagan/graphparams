import * as React from "react";
import {Solution} from "../types";

type Props = {
    index: number,
    solution: Solution,
    onSelect: (solution: Solution | null) => void;
};

class OutputSolution extends React.Component<Props> {
    public handleMouseOver = () => this.props.onSelect(this.props.solution);
    public handleMouseOut = () => this.props.onSelect(null);

    public render() {
        return (
            <React.Fragment>
                <a href="#" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
                    solution {this.props.index + 1}
                </a>
                <br/>
            </React.Fragment>
        );
    }
}

export default OutputSolution;
