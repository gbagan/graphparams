import {connect, createSelector, pick, React} from "@/commonreact";
import Col from 'antd/lib/col';

import {actions, selector} from '../redux';
import ParamCheckbox from './ParamCheckbox';

const divStyle = { width: "100%", height: "100%" };

const ParamInput = ({parameters, onToggleParameter}) => (
    <div style={divStyle}>{
        [1, 2, 3, 4].map(i =>
            <Col key={i} span={6}>
            {
                parameters.filter(p => p.cat === i).map(param =>
                    <ParamCheckbox key={param.name} data={param} onToggle={onToggleParameter} />
                )
            }
            </Col>
        )
    }</div>
);

export default
connect(
    createSelector(selector, pick('parameters')), {
        onToggleParameter: actions.toggleParameter,
    }
)(ParamInput);
