import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import {Background, Button, Card, Col, Row} from "@/ui";

import * as actions from "../redux/actions";
import selector from "../redux/selector";

import ActionDropDown from "./ActionDropdown";
import Grid from "./Grid";
import Output from "./Output";

const style = require("./Main.scss");

const mapStateToProps = createSelector(selector,
    ({boards, examples}) => ({boards, examples})
);

const mapDispatchToProps = {
    onSelectExample: actions.selectExample,
    onSelectGrid: actions.selectGrid,
    onSolve: actions.solve,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const render: React.SFC<Props> = ({ boards, examples, onSelectGrid, onSelectExample, onSolve }) => (
    <Background>
        <h1>Sudoku</h1>
        <Row gutter={16}>
            <Col>
                <ActionDropDown label="Choose a board" data={boards} action={onSelectGrid} />
                <ActionDropDown label="Choose an example" data={examples} action={onSelectExample} />
                <Button color="primary" onClick={onSolve}>Solve</Button>
                <Grid />
            </Col>
            <Col>
                <Card title="Output">
                    <Output className={style.output} />
                </Card>
            </Col>
        </Row>
    </Background>
);

export default connect(mapStateToProps, mapDispatchToProps)(render);
