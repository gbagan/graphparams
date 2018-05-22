import * as React from 'react';
import { connect } from 'react-redux';
import Card from 'antd/lib/card';

import * as actions from "../redux/actions";
import { State as RootState } from '../redux/reducers';
import { PosAndVal } from '../types';
import OutputSolution from './OutputSolution';

interface Props {
    solutions: ReadonlyArray<ReadonlyArray<PosAndVal>> | null;
    onSelectSolution: (solution: ReadonlyArray<PosAndVal> | null) => any;
}

const Output: React.SFC<Props> = (props) => {
    const { solutions, onSelectSolution } = props;
    return (
        <Card title="Output">{
            !solutions ? "Sudoku" : (solutions.length === 0 ? "No solution" :
                [<span>{solutions.length}  solution{solutions.length > 1 ? "s" : ""}</span>, (<br />),
                solutions.slice(0, 25).map((solution, index) => [
                    <OutputSolution key={index} index={index} solution={solution}
                        onSelect={onSelectSolution} />,
                    <br />]
                )]
            )
        }</Card>
    );
}

const mapStateToProps = (state: RootState) => ({
    solutions: state.solutions
});

const mapDispatchToProps = {
    onSelectSolution: actions.showSolution
}

export default connect(mapStateToProps, mapDispatchToProps)(Output)