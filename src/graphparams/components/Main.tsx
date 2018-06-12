import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import Background from "../../styled/Background";
import Button from "../../styled/Button";
import Card from "../../styled/Card";
import Row from "../../styled/Row";
import TextArea from "../../styled/TextArea";

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

const Main: React.SFC<Props> = props => {
    const { computing, onCodeChange } = props;

    return (
        <Background>
            <h1>Graph parameters</h1>
            <Row>
                <div>
                    <Row>
                        <div>
                            <Button color="primary" disabled={computing} onClick={props.onSelectAll}>
                                Select all
                                </Button>
                        </div>
                        <div>
                            <Button color="primary" disabled={computing} onClick={props.onUnselectAll}>
                                Unselect all
                                </Button>
                        </div>
                        <div>
                            <Button color="primary" disabled={computing} onClick={props.onCompute}>Compute</Button>
                        </div>
                        <div>
                            <Button color="primary" disabled={!computing} onClick={props.onSkip}>Skip</Button>
                        </div>
                    </Row>
                    <Row>
                        <ParamInput />
                    </Row>
                    <Row gutter={16}>
                        <div>
                            <TextArea className={style.code} onChange={e => onCodeChange(e.target.value)} value={props.code} />
                        </div>
                        <div>
                            <Card title="Output">
                                <Output className={style.output}/>
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
                        <div className={style.help}>{htmlize(props.helpText)}</div>
                    </Card>
                </div>
            </Row>
        </Background>
    );
};

function htmlize(text: string) {
    return text.split("\n").map((line, i) => [line, <br key={i} />]);
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
