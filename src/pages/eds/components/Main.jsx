import React from 'react';

import Card from 'antd/lib/card';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';

import { HELP_TEXT } from '../data';
import GraphInput from './GraphInput';
import VisEds from './VisEds';

import style from './Main.scss';


const htmlizedHelp =
    <React.Fragment>
        {HELP_TEXT.split("\n").map((line, i) => [line, <br />])}
    </React.Fragment>

const render = () => (
    <Row type="flex" justify="space-around" align="middle" className={style.container}>
        <Col>
            <GraphInput />
        </Col>
        <Col>
            <Card title="Graph">
                <VisEds className={style.viz} />
            </Card>
        </Col>
        <Col>
            <Card title="Help">
                <div className={style.help}>{htmlizedHelp}</div>
            </Card>
        </Col>
    </Row>
);

export default render;
