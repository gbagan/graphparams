import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import styled from "styled-components";

import Card from "antd/lib/card";
import Col from "antd/lib/col";
import Row from "antd/lib/row";

import selector from "../redux/selector";
import GraphInput from "./GraphInput";
import VisEds from "./VisEds";

const mapStateToProps = createSelector(selector, state => ({ helpText: state.helpText }));
const mapDispatchToProps = {};
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const Main = ({helpText}: Props) => {
    return (
        <div className="eds" >
            <h1>Eternal dominating set</h1>
            <Row type="flex">
                <Col>
                    <GraphInput />
                </Col>
                <Col>
                    <VisEds />
                </Col>
                <Col>
                    <HelpText title="Help">{htmlize(helpText)}</HelpText>
                </Col>
            </Row>
        </div>
    );
};

const HelpText = styled(Card)`
    height: 500px;
    width: 420px;
    background-color: lightgray;
    font-family: monospace;
    font-size: 10pt;
`;

const htmlize = (text: string) => text.split("\n").map((line, i) => [line, <br key={i}/>]);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
