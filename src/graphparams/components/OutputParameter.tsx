import * as React from "react";
import Text from "../../styled/Text";

import { GraphParameter, Result, Witness } from "../types.d";

type Props = {
    parameter: GraphParameter,
    onShowWitness: (w: Witness | null) => void,
};

export default class OutputParameter extends React.Component<Props> {
    public render() {
        const { parameter } = this.props;
        const { result } = parameter;
        return !result ? <span /> : <span>{parameter.fullname} : {this.outputResult(result)}</span>;
    }

    private handleMouseOver = () => {
        const result = this.props.parameter.result;
        if (result && result !== "computing" && result.witness) {
            const witness = { name: this.props.parameter.name, witness: result.witness };
            this.props.onShowWitness(witness);
        }
    }
    private handleMouseOut = () => this.props.onShowWitness(null);

    private outputResult(result: Result | "computing") {
        if (result === "computing") {
            return <Text color="warning">Computing</Text>;
        } else if (result.witness === null) {
            return result.result.toString();
        } else {
            const aEl = (
                <a href="#" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
                    {result.witness.toString()}
                </a>);
            return [result.result.toString(), " (", aEl, ")"];
        }
    }
}
