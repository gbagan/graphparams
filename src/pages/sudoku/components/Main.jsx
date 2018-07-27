import {connect, React} from "@/commonreact";
import Button from 'antd/lib/button';
import Card from 'antd/lib/card';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import {actions} from '../redux';

import ActionDropDown from './ActionDropdown';
import Grid from './Grid';
import Output from './Output';

import style from '../css/Main.scss';

import {boards, examples} from '../data';

const Main = ({onSelectGrid, onSelectExample, onSolve}) => (
    <React.Fragment>
        <Row>
            <ActionDropDown label="Choose a board" data={boards} action={onSelectGrid} />
            <ActionDropDown label="Choose an example" data={examples} action={onSelectExample} />
            <Button type="primary" onClick={onSolve}>Solve</Button>
        </Row>
        <Row className={style.full} type="flex" justify="space-around" align="middle">
            <Col>
                <Grid />
            </Col>
            <Col>
                <Card title="Sudoku">
                    <Output className={style.output} />
                </Card>
            </Col>
        </Row>
    </React.Fragment>
);

const mapStateToProps = () => ({});

const mapDispatchToProps = {
    onSelectExample: actions.selectExample,
    onSelectGrid: actions.selectGrid,
    onSolve: actions.solve,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
