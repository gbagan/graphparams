import * as React from "react";
import { generate as shortid } from "shortid";
import styled from "styled-components";

import Card from "antd/lib/card";
import Col from "antd/lib/col";
import Row from "antd/lib/row";

import Background from "../styled/Background";
import Form from "./Form";
import { Calc, solve } from "./solver";

const calcList: (c: Calc) => Calc[] = calc => calc.left ? calcList(calc.left).concat(calcList(calc.right!), calc) : [];

const calcToHTML = (c: Calc) =>
    calcList(c).map(calc => [
        <span key={shortid()}>{`${calc.left!.val} ${calc.operator} ${calc.right!.val} = ${calc.val}`}</span>,
        <br key={shortid()} />,
    ]);

type State = {
    readonly output: Calc | null;
};

type Props = {
};

export default class ChiffresApp extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            output: null,
        };
    }

    public handleSubmit = (values: ReadonlyArray<number>, target: number) => {
        const output = solve(values, target);
        this.setState({ output });
    }

    public render() {
        const result = !this.state.output ? "" : calcToHTML(this.state.output);

        return (
            <Background>
                <h1>Le compte est bon</h1>
                <Row type="flex">
                    <Col>
                        <Form onSubmit={this.handleSubmit} />
                        <Card title="Output">
                            <Output>{result}</Output>
                        </Card>
                    </Col>
                </Row>
            </Background>
        );
    }
}

const Output = styled.div`
    width: 400px;
    height: 400px;
`;
