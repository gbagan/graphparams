import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import styled from "styled-components";

import Button from "antd/lib/button";
import Card from "antd/lib/card";
import Col from "antd/lib/col";
import Row from "antd/lib/row";

import * as actions from "../redux/actions";
import selector from "../redux/selector";

import Layout from "../../styled/Layout";
import ActionDropDown from "./ActionDropdown";
import Grid from "./Grid";
import Output from "./Output";

const mapStateToProps = createSelector(selector, state => ({
    boards: state.boards,
    examples: state.examples,
}));

const mapDispatchToProps = {
    onSelectExample: actions.selectExample,
    onSelectGrid: actions.selectGrid,
    onSolve: actions.solve,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const Main = ({ boards, examples, onSelectGrid, onSelectExample, onSolve }: Props) => (
    <Layout>
        <div>
            <h1>Sudoku</h1>
            <Row type="flex" gutter={16}>
                <Col>
                    <ActionDropDown label="Choose a board" data={boards} action={onSelectGrid} />
                    <ActionDropDown label="Choose an example" data={examples} action={onSelectExample} />
                    <Button type="primary" onClick={onSolve}>Solve</Button>
                    <Grid />
                </Col>
                <Col>
                    <Card title="Output">
                        <StyledOutput />
                    </Card>
                </Col>
            </Row>
        </div>
    </Layout>
);

const StyledOutput = styled(Output)`
    width: 350px;
    height: 500px;
    font-family: monospace;
    font-size: 10pt;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Main);
