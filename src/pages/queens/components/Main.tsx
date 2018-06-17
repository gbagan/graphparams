import { compose, connect, createSelector, cx, React, toClass } from "@/commonreact";

import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import { Background, Button, Card, Col, Row } from "@/ui";
import {actions, selector} from "../redux";

import ActionDropDown from "../../sudoku/components/ActionDropdown";
import Grid from "./Grid";
import InitGrid from "./InitGrid";

const style = require("../css/queens.scss");

const mapStateToProps = createSelector(selector,
    ({isFinished}) => ({isFinished}),
);

const mapDispatchToProps = {
    onReset: actions.reset,
    onSelectGrid: actions.selectGrid,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const boards = [
    { name: "5x5", data: 5 },
    { name: "6x6", data: 6 },
    { name: "7x7", data: 7 },
    { name: "8x8", data: 8 },
    { name: "9x9", data: 9 },
    { name: "10x10", data: 10 },
];

const render: React.SFC<Props> = ({ isFinished, onSelectGrid, onReset }) => (
    <Background>
        <h1>Queens</h1>
        <Row>
            <Col>
                <ActionDropDown label="Choose a board" data={boards} action={onSelectGrid} />
                <Button onClick={onReset}>Reset</Button>
                <InitGrid />
                <Grid />
            </Col>
        </Row>
        <div className={cx(style.dialogcontainer, {[style.hidden]: !isFinished})}>
            <div className={style.dialog}>
                <Card title="Bravo">
                    <Button color="primary" >Continue</Button>
                    <Button color="primary" onClick={onReset}>Restart</Button>
               </Card>
            </div>
        </div>
    </Background>
);

export default
compose<Props, {}>(
    DragDropContext(HTML5Backend),
    toClass,
    connect(mapStateToProps, mapDispatchToProps),
)
(render);
