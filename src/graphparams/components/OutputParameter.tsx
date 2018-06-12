import * as React from "react";
import Text from "../../styled/Text";

import { GraphParameter, Result } from "../types.d";

type Props = {
    parameter: GraphParameter,
    onShowWitness: (p: GraphParameter | null) => void,
};

 const OutputParameter: React.SFC<Props> = props => {
    const { result, fullname } = props.parameter;
    return !result
        ? <span/>
        : <React.Fragment>
            <span>{fullname} : {outputResult(result, props)}</span>
            <br/>
         </React.Fragment>
}

const outputResult = (result: Result | "computing", props: Props) => {
    if (result === "computing") {
        return <Text color="warning">Computing</Text>;
    } else if (result.witness === null) {
        return result.result.toString();
    } else {
        const aEl = (
            <a href="#" onMouseOver={() => props.onShowWitness(props.parameter)}
                onMouseOut={() => props.onShowWitness(null)}>
                {result.witness.toString()}
            </a>);
        return [result.result.toString(), " (", aEl, ")"];
    }
}

export default OutputParameter;