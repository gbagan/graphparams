import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import Text from "@/styled/Text";

import * as actions from "../redux/actions";
import selector from "../redux/selector";
import OutputParameter from "./OutputParameter";

const mapStateToProps = createSelector(selector, state => ({
    error: state.error,
    parameters: state.parameters,
}));

const mapDispatchToProps = {
    onShowWitness: actions.showWitness,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & { className?: string };

const Output: React.SFC<Props> = (props) => {
    return (
        <div className={props.className} title="Output">
        {
            props.error 
            ? <Text color="error">{props.error}</Text>
            : props.parameters.filter(p => p.result !== null).map(param =>
                <OutputParameter key={param.name} parameter={param} onShowWitness={props.onShowWitness} />
            )
        }
        </div>
    )
};

export default connect(mapStateToProps, mapDispatchToProps)(Output);
