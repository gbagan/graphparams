import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import styled from "styled-components";

import Button from "antd/lib/button";
import Col from "antd/lib/col";
import Row from "antd/lib/row";

import Card from "../../styled/Card";
import Layout from "../../styled/Layout";
import TextArea from "../../styled/TextArea";
import GraphOutput from "./GraphOutput";
import Output from "./Output";
import ParamInput from "./ParamInput";

import * as actions from "../redux/actions";
import selector from "../redux/selector";

const mapStateToProps = createSelector(selector, state => ({
    code: state.code,
    computing: state.computing,
    helpText: state.helpText,
}));

const mapDispatchToProps = {
    onCodeChange: actions.changeCode,
    onCompute: actions.asyncCompute,
    onSelectAll: actions.selectAll,
    onSkip: actions.skip,
    onUnselectAll: actions.unselectAll,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const Main: React.SFC<Props> = props => {
    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => props.onCodeChange(e.target.value);

    return (
        <Layout>
            <div>
                <h1>Graph parameters</h1>
                <Row type="flex">
                    <Col span={17}>
                        <Row>
                            <Button type="primary" disabled={props.computing} onClick={props.onSelectAll}>
                                Select all
                        </Button>
                            <Button type="primary" disabled={props.computing} onClick={props.onUnselectAll}>
                                Unselect all
                        </Button>
                            <Button type="primary" disabled={props.computing} onClick={props.onCompute}>Compute</Button>
                            <Button type="primary" disabled={!props.computing} onClick={props.onSkip}>Skip</Button>
                        </Row>
                        <Row type="flex">
                            <ParamInput />
                        </Row>
                        <Row type="flex" gutter={16}>
                            <Col>
                                <CodeInput onChange={handleCodeChange} value={props.code} />
                            </Col>
                            <Col>
                                <Card title="Output">
                                    <StyledOutput />
                                </Card>
                            </Col>
                            <Col>
                                <Card title="Graph">
                                    <StyledGraphOutput />
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Card title="Help">
                            <HelpText>{htmlize(props.helpText)}</HelpText>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Layout>
    );
};

function htmlize(text: string) {
    return text.split("\n").map((line, i) => [line, <br key={i} />]);
}

const CodeInput = styled(TextArea)`
height: 400px;
width: 300px;
`;

const HelpText = styled.div`
height: 650px;
width: 340px;
overflow: auto;
`;

const StyledOutput = styled(Output)`
height: 450px;
width: 400px;
overflow: auto;
`;

const StyledGraphOutput = styled(GraphOutput)`
height: 400px;
width: 400px;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Main);
