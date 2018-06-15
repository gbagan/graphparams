import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import {Card} from "@/ui";

import * as actions from "../redux/actions";
import selector from "../redux/selector";
import OutputSolution from "./OutputSolution";

const mapStateToProps = createSelector(selector,
    ({solutions}) => ({solutions})
);

const mapDispatchToProps = {
    onSelectSolution: actions.showSolution,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const render: React.SFC<Props> = ({solutions, onSelectSolution}) => {
    const data =
        !solutions ? "Lights Out" 
        : solutions.length === 0 ? "No solution"
        :
        <React.Fragment>
            <span>{solutions.length} solution{solutions.length > 1 ? "s" : ""}</span>
            <br />
            {
                solutions.slice(0, 25).map((solution, index) =>
                    <React.Fragment>
                        <OutputSolution index={index} solution={solution} onSelect={onSelectSolution} />,
                        <br/>
                    </React.Fragment>
                )
            }
        </React.Fragment>

    return <Card title="Output" className="output">{data}</Card>
};

export default connect(mapStateToProps, mapDispatchToProps)(render);
