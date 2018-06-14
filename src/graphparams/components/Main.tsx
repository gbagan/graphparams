import * as React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { createSelector } from "reselect";

import { Background, Button, Card, Row, TextArea } from "@/ui";

import GraphOutput from "./GraphOutput";
import Output from "./Output";
import ParamInput from "./ParamInput";

import * as actions from "../redux/actions";
import selector from "../redux/selector";

const style = require("./Main.scss");

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

type HandlerProps = {
    handleCodeChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}


const render: React.SFC<Props & HandlerProps> = ({ computing, handleCodeChange, code, helpText,
                                                    onSelectAll, onUnselectAll, onCompute, onSkip }) =>
    <Background>
        <h1>Graph parameters</h1>
        <Row>
            <div>
                <Row>
                    <div>
                        <Button color="primary" disabled={computing} onClick={onSelectAll}>
                            Select all
                            </Button>
                    </div>
                    <div>
                        <Button color="primary" disabled={computing} onClick={onUnselectAll}>
                            Unselect all
                                </Button>
                    </div>
                    <div>
                        <Button color="primary" disabled={computing} onClick={onCompute}>Compute</Button>
                    </div>
                    <div>
                        <Button color="primary" disabled={!computing} onClick={onSkip}>Skip</Button>
                    </div>
                </Row>
                <Row>
                    <ParamInput />
                </Row>
                <Row gutter={16}>
                    <div>
                        <TextArea className={style.code} onChange={handleCodeChange} value={code} />
                    </div>
                    <div>
                        <Card title="Output">
                            <Output className={style.output} />
                        </Card>
                    </div>
                    <div>
                        <Card title="Graph">
                            <GraphOutput className={style.graphoutput} />
                        </Card>
                    </div>
                </Row>
            </div>
            <div>
                <Card title="Help">
                    <div className={style.help}>{htmlize(helpText)}</div>
                </Card>
            </div>
        </Row>
    </Background>

function htmlize(text: string) {
    return text.split("\n").map((line, i) => [line, <br key={i} />]);
}


export default
    compose<Props & HandlerProps, {}>(
        connect(mapStateToProps, mapDispatchToProps),
        withHandlers<Props, HandlerProps>({
            handleCodeChange: ({ onCodeChange }) => e => onCodeChange(e.target.value)
        })
    )(render);
