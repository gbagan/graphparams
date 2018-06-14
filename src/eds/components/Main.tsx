import * as React from "react";

import {Background, Card, Col, Row} from "@/ui";

import {HELP_TEXT} from "../data";
import GraphInput from "./GraphInput";
import VisEds from "./VisEds";

const style = require("./Main.scss");


const htmlizedHelp =
    <React.Fragment>
        {HELP_TEXT.split("\n").map((line, i) => [line, <br/>])}
    </React.Fragment>

const render: React.SFC<{}> = () => {
    return (
        <Background>
            <h1>Eternal dominating set</h1>
            <Row gutter={32}>
                <Col>
                    <GraphInput />
                </Col>
                <Col>
                    <Card title="Graph">
                        <VisEds className={style.viz} />
                    </Card>
                </Col>
                <Col>
                    <Card title="Help">
                        <div className={style.help}>{htmlizedHelp}</div>
                    </Card>
                </Col>
            </Row>
        </Background>
    );
};

export default render;
