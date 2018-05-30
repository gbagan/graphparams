import * as React from 'react';

import { GraphParameter, Result, Witness } from '../types.d';

interface Props {
    parameter: GraphParameter,
    onShowWitness: (w: Witness|null) => void,
}

const OutputParameter: React.SFC<Props> = (props) => {
    const { parameter } = props;
    const { result } = parameter;
    if (!result) return <span></span>  /////////////
    return (
        <span>{parameter.fullname} : {outputResult(props, parameter.name, result)}</span>
    )
}

function outputResult(props: Props, name: string, result: Result | "computing") {
    if (result === "computing")
        return <span className="warning">Computing</span>
    else if (result.witness === null)
        return result.result.toString();
    else {
        const witness = {name, witness: result.witness};
        return [result.result.toString(),
                " (", <a href="#" onMouseOver={() => props.onShowWitness(witness)} onMouseOut={() => props.onShowWitness(null)}>
                    {result.witness.toString()}</a>,
                ")"]
    }
}



export default OutputParameter;