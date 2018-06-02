import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import Card from "antd/lib/card";

import * as actions from "../redux/actions";
import selector from "../redux/selector";
import OutputSolution from "./OutputSolution";

const mapStateToProps = createSelector(selector, state => ({
    solutions: state.solutions,
}));

const mapDispatchToProps = {
    onSelectSolution: actions.showSolution,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const Output: React.SFC<Props> = (props) => {
    const { solutions, onSelectSolution } = props;

    const data = !solutions ? "Lights Out" : (solutions.length === 0 ? "No solution" :
        [<span key={0}>{solutions.length} solution{solutions.length > 1 ? "s" : ""}</span>, (<br />),
        solutions.slice(0, 25).map((solution, index) => [
            <OutputSolution key={index} index={index} solution={solution} onSelect={onSelectSolution} />,
            <br key={index} />])]);

    return <Card title="Output" className="output">{data}</Card>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Output);
