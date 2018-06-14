import * as React from "react";
import {connect} from "react-redux";
import {createSelector} from "reselect";
import {generate as shortid} from "shortid";

import * as actions from "../redux/actions";
import selector from "../redux/selector";
import OutputSolution from "./OutputSolution";

const mapStateToProps = createSelector(selector, ({solutions}) => ({
    solutions
}));

const mapDispatchToProps = {
    onSelectSolution: actions.showSolution,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;
type ClassProps = {
    className?: string;
}

const render: React.SFC<Props & ClassProps> = ({ solutions, onSelectSolution, className }) => (
    <div className={className}>
    {
        !solutions 
            ? "Sudoku"
        : solutions.length === 0
            ? "No solution"
            : <React.Fragment>
                <p key={shortid()}>{solutions.length}  solution{solutions.length > 1 ? "s" : ""}</p>
                {
                    solutions.slice(0, 25).map((solution, index) =>
                        <OutputSolution
                            key={shortid()}
                            index={index}
                            solution={solution}
                            onSelect={onSelectSolution}
                        />
                    )
                }
            </React.Fragment>
    }
    </div>
);

export default
connect(mapStateToProps, mapDispatchToProps)(render);