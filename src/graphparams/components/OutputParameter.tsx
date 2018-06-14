import * as React from "react";
import {withHandlers} from "recompose";
import {Text} from "@/ui";

import {GraphParameter} from "../types";

type Props = {
    parameter: GraphParameter;
    onShowWitness: (p: GraphParameter | null) => void;
};

type HandlerProps = {
    handleShowWitness: () => void;
    handleHideWitness: () => void;
}

const render: React.SFC<Props & HandlerProps> = ({parameter, handleShowWitness, handleHideWitness}) => {
    const { result, fullname } = parameter;
    if (!result) return <span />;

    let resultJsx: JSX.Element | string;
    if (result === "computing") {
        resultJsx = <Text color="warning">Computing</Text>;
    } else if (result.witness === null) {
        resultJsx = result.result.toString();
    } else {
        const result2 = result.result.toString();
        const witness = result.witness.toString();
        resultJsx = (
            <React.Fragment>
                {result2}
                (
                <a href="#" onMouseOver={handleShowWitness} onMouseOut={handleHideWitness}>
                    {witness}
                </a>
                )
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <span>{fullname} : {resultJsx}</span>
            <br />
        </React.Fragment>
    )
};

export default
withHandlers<Props, HandlerProps>({
    handleShowWitness: ({onShowWitness, parameter}) => () => onShowWitness(parameter),
    handleHideWitness: ({onShowWitness}) => () => onShowWitness(null),
})((render));
