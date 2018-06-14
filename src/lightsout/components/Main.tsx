import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Row from "antd/lib/row";

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
        <Row type="flex" gutter={16}>
            <Form onSubmit={onFormSubmit} />
        </Row>
        <Row>
            <Button type="primary" disabled={boardIsNull} onClick={onReverse} >Reverse</Button>
            <Button type="primary" disabled={boardIsNull || solutionsComputed} onClick={onSolve}>Solve</Button>
        </Row>
        <Row type="flex" gutter={16}>
            <Col><Board /></Col>
            <Col><Output /></Col>
        </Row>
    </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
