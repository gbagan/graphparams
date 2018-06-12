import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import styled from "styled-components";

import Card from "antd/lib/card";
import Col from "antd/lib/col";
import Row from "antd/lib/row";

import Background from "../../styled/Background";
import selector from "../redux/selector";
import GraphInput from "./GraphInput";
import VisEds from "./VisEds";

const mapStateToProps = createSelector(selector, state => ({ helpText: state.helpText }));
const mapDispatchToProps = {};
type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const Main = ({ helpText }: Props) => {
    return (
        <Background>
            <h1>Eternal dominating set</h1>
            <Row type="flex" gutter={32}>
                <Col>
                    <GraphInput />
                </Col>
                <Col>
                    <Card title="Graph">
                        <StyledVisEds />
                    </Card>
                </Col>
                <Col>
                    <Card title="Help">
                        <HelpText>{htmlize(helpText)}</HelpText>
                    </Card>
                </Col>
            </Row>
        </Background>
    );
};

const StyledVisEds = styled(VisEds)`
height: 600px;
width: 700px;
`;

const HelpText = styled.div`
height: 700px;
width: 400px;
overflow: auto;
`;

const htmlize = (text: string) => text.split("\n").map((line, i) => [line, <br key={i} />]);

export default connect(mapStateToProps, mapDispatchToProps)(Main);
