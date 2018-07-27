import * as React from "react";
import {withStateHandlers} from "recompose";

import newId from "@/lib/id";
import Button from 'antd/lib/button';
import Card from 'antd/lib/card';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';

import Form from "./Form";
import solve from "@/lib/chiffres/solver";

import style from './App.scss';

const calcList = calc =>
    !calc.left ? [] : calcList(calc.left).concat(calcList(calc.right), calc);

const calcToHTML = c =>
    calcList(c).map(calc =>
        <React.Fragment key={newId()}>
            <span>{`${calc.left.val} ${calc.operator} ${calc.right.val} = ${calc.val}`}</span>
            <br />
        </React.Fragment>
    );

const render = ({output, handleSubmit}) => (
    <Row type="flex" justify="space-around" align="middle" className={style.container}>
        <Col>
            <Form onSubmit={handleSubmit} />
            <Card title="Output" className={style.outputcard}>
                <div className={style.output}>
                    {!output ? '' : calcToHTML(output)}
                </div>
            </Card>
        </Col>
    </Row>
);

export default
withStateHandlers({
    output: null
},{
    handleSubmit: state => (values, target) => ({output: solve(values, target)})
})
(render);
