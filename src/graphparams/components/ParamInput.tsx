import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import Col from "antd/lib/col";

import * as actions from "../redux/actions";
import selector from "../redux/selector";
import ParamCheckbox from "./ParamCheckbox";

const mapStateToProps = createSelector(selector, state => ({ parameters: state.parameters }));
const mapDispatchToProps = { onToggleParameter: actions.toggleParameter };
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const ParamInput: React.SFC<Props> = props => {
    const { parameters, onToggleParameter } = props;

    const col = (i: number) => parameters.filter(param => param.cat === i).map((param, j) =>
            [<ParamCheckbox key={param.name} data={param} onToggle={onToggleParameter} />, <br key={j} />]);

    return (
        <div style={{ width: "100%", height: "100%" }}>
            {[1, 2, 3, 4].map(i => <Col key={i} span={6}>{col(i)}</Col>)}
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ParamInput);
