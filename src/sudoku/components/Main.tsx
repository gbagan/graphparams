import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Layout from "antd/lib/layout";
import Row from "antd/lib/row";

import * as actions from "../redux/actions";
import selector from "../redux/selector";

import ActionDropDown from "./actiondropdown";
import Grid from "./grid";
import Output from "./output";

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

const Main: React.SFC<Props> = (props) => {
    const { boards, examples, onSelectGrid, onSelectExample, onSolve } = props;

    return (
        <Layout style={{ height: "100vh" }}>
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
                        <Output />
                    </Col>
                </Row>
            </div>
        </Layout>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
