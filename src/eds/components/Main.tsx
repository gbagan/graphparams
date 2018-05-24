import * as React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Card from 'antd/lib/card';

import GraphInput from './GraphInput';
import VisEds from './VisEds';

import { selector, State as ReduxState } from '../redux/reducers';
const mapStateToProps = createSelector(selector, (state: ReduxState) => ({ helpText: state.helpText }));
const mapDispatchToProps = {}
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

const Main: React.SFC<Props> = (props: Props) => {
    return (
        <div className="eds" >
            <h1>Eternal dominating set</h1>
            <Row type="flex">
                <Col>
                    <GraphInput />
                </Col>
                <Col>
                    <VisEds />
                </Col>
                <Col>
                    <Card title="Help">{htmlize(props.helpText)}</Card>
                </Col>
            </Row>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)


function htmlize(text: string) {
    return text.split("\n").map(line => [line, <br/>]);
}