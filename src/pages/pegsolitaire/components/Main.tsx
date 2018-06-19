import { connect, cxbind, React } from "@/commonreact";

import { Background, Button, Col} from "@/ui";
import {actions, selector} from "../redux";
import * as boards from "../boards";
import Grid from "./Grid";
import Minigrid from "./Minigrid";
const style = require("../css/style.scss");
const cx = cxbind(style);

const mapStateToProps = selector;

const mapDispatchToProps = {
    undo: actions.undo,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const render: React.SFC<Props> = ({emptyHistory, undo}) => (
    <Background>
        <h1>Queens</h1>
        <div className={cx("container")}>
            <Col/>
            <Col>
                <Button large disabled={emptyHistory} onClick={undo}>Undo</Button>
                <Grid />
            </Col>
            <Col className={cx("mini")}>
                <Minigrid {...boards.english}/>
                <Minigrid {...boards.french}/>
                <Minigrid {...boards.diamond}/>
                <Minigrid {...boards.wiegleb}/>
                <Minigrid {...boards.asymetric}/>
            </Col>
        </div>
    </Background>
);

export default
connect(mapStateToProps, mapDispatchToProps)(render);
