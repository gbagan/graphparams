import * as React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Button from 'antd/lib/button';

import selector from '../redux/selector';
import * as actions from "../redux/actions";
import ActionDropDown from './actiondropdown';
import Output from './output';
import Grid from './grid';

const mapStateToProps = createSelector(selector, state => ({
    boards: state.boards,
    examples: state.examples,
}));

const mapDispatchToProps = {
    onSelectGrid: actions.selectGrid,
    onSelectExample: actions.selectExample,
    onSolve: actions.solve
}

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps

const Main: React.SFC<Props> = (props) => {
    const { boards, examples, onSelectGrid, onSelectExample, onSolve } = props;

    return (
        <div className="sudoku" >
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
    )
}
export default connect(mapStateToProps, mapDispatchToProps)(Main)
