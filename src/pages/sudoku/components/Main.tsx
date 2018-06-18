import {connect, React} from "@/commonreact";
import {Background, Button, Card, Col, Row} from "@/ui";
import {actions} from "../redux";

import ActionDropDown from "./ActionDropdown";
import Grid from "./Grid";
import Output from "./Output";

const style = require("../css/Main.scss");

import {boards, examples} from "../data";

const mapStateToProps = () => ({});

const mapDispatchToProps = {
    onSelectExample: actions.selectExample,
    onSelectGrid: actions.selectGrid,
    onSolve: actions.solve,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const render: React.SFC<Props> = ({ onSelectGrid, onSelectExample, onSolve }) => (
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
