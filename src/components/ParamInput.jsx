import {connect, createSelector, pick, React} from "@/commonreact"
import Col from 'antd/lib/col'
import Row from 'antd/lib/row'
import {actions, selector} from '../reducers'
import ParamCheckbox from './ParamCheckbox'

const divStyle = { width: "100%", height: "100%" }

const ParamInput = ({parameters, onToggleParameter}) => (
    <Row style={divStyle}>{
        [1, 2, 3, 4].map(i =>
            <Col span={6}>
            {
                parameters.filter(p => p.cat === i).map(param =>
                    <ParamCheckbox key={param.name} data={param} onToggle={onToggleParameter} />
                )
            }
            </Col>
        )
    }</Row>
);

export default
connect(
    createSelector(selector, pick('parameters')), {
        onToggleParameter: actions.toggleParameter,
    }
)(ParamInput)
