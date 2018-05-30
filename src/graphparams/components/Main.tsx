import * as React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Card from 'antd/lib/card';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';

import ParamInput from './ParamInput';
import Output from './Output';
import GraphOutput from './GraphOutput';
import * as actions from '../redux/actions';
import selector from '../redux/selector';

const mapStateToProps = createSelector(selector, state => ({
    code: state.code,
    helpText: state.helpText,
    computing: state.computing
}));
const mapDispatchToProps = {
    onSelectAll: actions.selectAll,
    onUnselectAll: actions.unselectAll,
    onCompute: actions.asyncCompute,
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
                <Col span={18}>
                    <Row>
                        <Button type="primary" disabled={props.computing} onClick={props.onSelectAll}>Select all</Button>
                        <Button type="primary" disabled={props.computing} onClick={props.onUnselectAll}>Unselect all</Button>
                        <Button type="primary" disabled={props.computing} onClick={props.onCompute}>Compute</Button>
                        <Button type="primary" disabled={!props.computing} onClick={props.onSkip}>Skip</Button>
                    </Row>
                    <Row type="flex">
                        <ParamInput />
                    </Row>
                    <Row type="flex" gutter={16}>
                        <Col>
                            <Card className="graphinput" title="Input">
                                <Input.TextArea onChange={handleCodeChange} value={props.code} />
                            </Card>
                        </Col>
                        <Col>
                            <Output />
                        </Col>
                        <Col>
                            <GraphOutput />
                        </Col>
                    </Row>
                </Col>
                <Col span={6}>
                    <Card className="helptext" title="Help">{htmlize(props.helpText)}</Card>
                </Col>
            </Row>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

function htmlize(text: string) {
    return text.split("\n").map(line => [line, <br />]);
}