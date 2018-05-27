import * as React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Card from 'antd/lib/card';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';

//import GraphInput from './GraphInput';
import ParamInput from './ParamInput';
//import VisEds from './VisEds';
import * as actions from '../redux/actions';
import selector from '../redux/selector';

const mapStateToProps = createSelector(selector, state => ({
    code: state.code,
    helpText: state.helpText
}));
const mapDispatchToProps = {
    onSelectAll: actions.selectAll,
    onUnselectAll: actions.unselectAll,
    onCompute: actions.computeGraphRequest,
    onSkip: actions.skip,
    onCodeChange: actions.changeCode
}
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

const Main: React.SFC<Props> = props => {
    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => props.onCodeChange(e.target.value);

    return (
        <div className="graphparams" >
            <h1>Graph parameters</h1>
            <Row type="flex">
                <Col span={16}>
                    <Row>
                        <Button color="primary" onClick={props.onSelectAll}>Select all</Button>
                        <Button color="primary" onClick={props.onUnselectAll}>Unselect all</Button>
                        <Button color="primary" onClick={props.onCompute}>Compute</Button>
                        <Button color="primary" onClick={props.onSkip}>Skip</Button>
                    </Row>
                    <Row type="flex">
                        <ParamInput />
                    </Row>
                    <Row type="flex">
                        <Col>
                            <Input.TextArea rows={12} cols={40} className="graphinput" onChange={handleCodeChange} value={props.code} />
                        </Col>
                        <Col>
                            <Card title="Output" />
                        </Col>
                    </Row>
                </Col>
                <Col span={8}>
                    <Card title="Help">{htmlize(props.helpText)}</Card>
                </Col>
            </Row>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)


function htmlize(text: string) {
    return text.split("\n").map(line => [line, <br />]);
}