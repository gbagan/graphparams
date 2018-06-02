import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import Card from "antd/lib/card";

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

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const Output: React.SFC<Props> = (props) => {
    const data = props.error ? <span className="error">{props.error}</span>
        : props.parameters.filter(p => p.result !== null).map(param =>
            [<OutputParameter key={param.name} parameter={param} onShowWitness={props.onShowWitness} />,
            <br key={param.name + "BR"} />]);

    return <Card className="output" title="Output">{data}</Card>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Output);
