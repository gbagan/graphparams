import { compose, connect, createSelector, React, withHandlers } from "@/commonreact";
import Button from 'antd/lib/button';
import Card from 'antd/lib/card';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Input from 'antd/lib/input';

import GraphOutput from './GraphOutput';
import Output from './Output';
import ParamInput from './ParamInput';

import { actions, selector } from '../redux';
import { HELP_TEXT } from '../data';

import style from '../css/style.scss';

const htmlizedHelp = (
    <React.Fragment>
        {HELP_TEXT.split("\n").map((line, i) => [line, <br />])}
    </React.Fragment>
);

const mapStateToProps = createSelector(selector,
    ({ code, computing }) => ({ code, computing })
);

const mapDispatchToProps = {
    onCodeChange: actions.changeCode,
    onCompute: actions.asyncCompute,
    onSelectAll: actions.selectAll,
    onSkip: actions.skip,
    onUnselectAll: actions.unselectAll,
};

const render = ({ computing, code, handleCodeChange, onSelectAll, onUnselectAll, onCompute, onSkip }) => (
    <Row type="flex" justify="space-between" align="top">
        <Col span="18">
            <Row>
                <Button color="primary" disabled={computing} onClick={onSelectAll}>
                    Select all
                </Button>
                <Button type="primary" disabled={computing} onClick={onUnselectAll}>
                    Unselect all
                </Button>
                <Button color="primary" disabled={computing} onClick={onCompute}>Compute</Button>
                <Button color="primary" disabled={!computing} onClick={onSkip}>Skip</Button>
            </Row>
            <Row>
                <ParamInput />
            </Row>
            <Row type="flex" justify="space-around" align="top">
                <Col>
                    <Input.TextArea className={style.code} rows="15" cols="40" onChange={handleCodeChange} value={code} />
                </Col>
                <Col>
                    <Card title="Output">
                        <Output className={style.output} />
                    </Card>
                </Col>
                <Col>
                    <Card title="Graph">
                        <GraphOutput className={style.graphoutput} />
                    </Card>
                </Col>
            </Row>
        </Col>
        <Col>
            <Card title="Help">
                <div className={style.help}>{htmlizedHelp}</div>
            </Card>
        </Col>
    </Row>
);

export default
    compose(
        connect(mapStateToProps, mapDispatchToProps),
        withHandlers({
            handleCodeChange: ({ onCodeChange }) => e => onCodeChange(e.target.value)
        }),
    )(render);
