import * as React from "react";
import {withStateHandlers} from "recompose";

import newId from "@/lib/id";
import {Background, Card, Col, Row} from "@/ui";

import Form from "./Form";
import { Calc, solve } from "@/lib/chiffres/solver";

const style = require("./App.scss");

type State = {
    output: Calc | null;
};

type HandlerProps = {
    handleSubmit: (values: number[], target: number) => Partial<State>;
};

function calcList (calc: Calc): Calc[] {
    if (!calc.left)
        return [];
    else 
        return calcList(calc.left).concat(calcList(calc.right!), calc);
}

const calcToHTML = (c: Calc) =>
    calcList(c).map(calc =>
        <React.Fragment key={newId()}>
            <span>{`${calc.left!.val} ${calc.operator} ${calc.right!.val} = ${calc.val}`}</span>
            <br />
        </React.Fragment>
    );

const render: React.SFC<State & HandlerProps> = ({output, handleSubmit}) => {
    const result = !output ? "" : calcToHTML(output);

    return (
        <Background>
            <h1>Le compte est bon</h1>
            <Row>
                <Col>
                    <Form onSubmit={handleSubmit} />
                    <Card title="Output">
                        <div className={style.output}>{result}</div>
                    </Card>
                </Col>
            </Row>
        </Background>
    );
}

export default
withStateHandlers<State, HandlerProps, {}>({
    output: null
},{
    handleSubmit: state => (values, target) => ({ output: solve(values, target) })
})
(render);
