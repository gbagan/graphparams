import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import {Button, Col, Row} from "@/ui";

import * as actions from "../redux/actions";
import selector from "../redux/selector";
import Board from "./Board";
import Form from "./Form";
import Output from "./Output";

const mapStateToProps = createSelector(selector, ({board, solutions}) => ({
    boardIsNull: !board,
    solutionsComputed: !!solutions,
}));

const mapDispatchToProps = {
    onFormSubmit: actions.generate,
    onReverse: actions.reverse,
    onSolve: actions.solve,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const Main: React.SFC<Props> = ({boardIsNull, solutionsComputed, onReverse, onSolve, onFormSubmit}) => (
    <div>
        <h1>Lights Out</h1>
        <Row gutter={16}>
            <Form onSubmit={onFormSubmit} />
        </Row>
        <Row>
            <Button color="primary" disabled={boardIsNull} onClick={onReverse} >Reverse</Button>
            <Button color="primary" disabled={boardIsNull || solutionsComputed} onClick={onSolve}>Solve</Button>
        </Row>
        <Row gutter={16}>
            <Col><Board /></Col>
            <Col><Output /></Col>
        </Row>
    </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
