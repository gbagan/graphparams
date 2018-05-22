import * as React from 'react';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Card from 'antd/lib/card';


import './App.css';
import { Calc, solve } from './solver';
import ChiffresForm from './Form';

function calcToHTML(calc: Calc): JSX.Element[] {
    if (calc.left === undefined) {
        return [<span />];
    } else {
        return calcToHTML(calc.left).concat(calcToHTML(calc.right!))
            .concat([<span>{`${calc.left.val} ${calc.operator} ${calc.right!.val} = ${calc.val}`}</span>, <br />]);
    }
}


interface State {
    readonly output: Calc | null;
}

interface Props {
}

export default class ChiffresApp extends React.Component<Props, State> {
    constructor(props: any) {
        super(props);
        this.state = {
            output: null
        }
    }

    handleSubmit = (values: ReadonlyArray<number>, target: number)  => {
        const output = solve(values, target);
        this.setState({ output });
    }

    render() {
        const result = !this.state.output ? "" : calcToHTML(this.state.output);

        return (
            <div>
                <h1>Le compte est bon</h1>
                <Row type="flex">
                    <Col>
                        <ChiffresForm onSubmit={this.handleSubmit} />
                        <Card title="Output">{result}</Card>
                    </Col>
                </Row>
            </div>
        );
    }
}
