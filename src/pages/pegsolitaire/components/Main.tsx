import { connect, cxbind, React } from "@/commonreact";

import { Background, Button, Col} from "@/ui";
import {actions} from "../redux";

import Grid from "./Grid";

const style = require("../css/style.scss");
const cx = cxbind(style);

const mapStateToProps = () => ({});

const mapDispatchToProps = {
    onReset: actions.reset,
    onSelectGrid: actions.selectGrid,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const render: React.SFC<Props> = ({ }) => (
    <Background>
        <h1>Queens</h1>
        <div className={cx("container")}>
            <Col>
                <Button>Reset</Button>
                <Grid />
            </Col>
        </div>
    </Background>
);

export default
connect(mapStateToProps, mapDispatchToProps)(render);
