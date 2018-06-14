import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import {Col} from "@/ui";

import * as actions from "../redux/actions";
import selector from "../redux/selector";
import ParamCheckbox from "./ParamCheckbox";

const mapStateToProps = createSelector(selector,
    ({parameters}) => ({parameters})
);
const mapDispatchToProps = {
    onToggleParameter: actions.toggleParameter
};
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const ParamInput: React.SFC<Props> = ({parameters, onToggleParameter}) => (
    <div style={{ width: "100%", height: "100%" }}>
    {
        [1, 2, 3, 4].map(i =>
            <Col key={i} span={6}>
            {
                parameters.filter(p => p.cat === i).map(param =>
                    <ParamCheckbox key={param.name} data={param} onToggle={onToggleParameter} />
                )
            }
            </Col>
        )
    }
    </div>
)


export default connect(mapStateToProps, mapDispatchToProps)(ParamInput);
