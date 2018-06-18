import {connect, createSelector, cxbind, React} from "@/commonreact";


import { Background, Button, Card, Col} from "@/ui";
import {actions, selector} from "../redux";

import ActionDropDown from "../../sudoku/components/ActionDropdown";
import Grid from "./Grid";

const style = require("../css/style.scss");
const cx = cxbind(style);

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
        <div className={style.container}>
            <Col>
                <ActionDropDown label="Choose a board" data={boards} action={onSelectGrid} />
                <Button onClick={onReset}>Reset</Button>
                <Grid init />
                <Grid />
            </Col>
        </div>
        <div className={cx("dialogcontainer", {hidden: !isFinished})}>
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
connect(mapStateToProps, mapDispatchToProps)(render);
