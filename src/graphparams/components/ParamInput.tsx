import * as React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Col from 'antd/lib/col';

import ParamCheckbox from './ParamCheckbox';
import * as actions from '../redux/actions';
import selector from '../redux/selector';

const mapStateToProps = createSelector(selector, state => ({ parameters: state.parameters }));
const mapDispatchToProps = { onToggleParameter: actions.toggleParameter }
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

const ParamInput: React.SFC<Props> = props => {
    const { parameters, onToggleParameter } = props;
    return (
        <div style={{width: "100%", height: "100%"}}>{
            [1, 2, 3, 4].map(i =>
                <Col key={i} span={6}>
                    {
                        parameters.filter(param => param.cat === i).map(param =>
                            [<ParamCheckbox key={param.name} data={param} onToggle={onToggleParameter}  />, <br/>]
                        )
                    }
                </Col>
            )
        }    
        </div>
    )
}

export default connect(mapStateToProps,mapDispatchToProps)(ParamInput);