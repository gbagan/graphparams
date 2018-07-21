import {connect, createSelector, React} from '@/commonreact';
import {actions, selector} from '../redux';
import OutputSolution from './OutputSolution';

const render = ({ solutions, onSelectSolution, className }) => (
    <div className={className}>
    {
        !solutions 
            ? 'Sudoku'
        : solutions.length === 0
            ? 'No solution'
            : <React.Fragment>
                <p>{solutions.length}  solution{solutions.length > 1 ? 's' : ''}</p>
                {
                    solutions.slice(0, 25).map((solution, index) =>
                        <OutputSolution
                            key={index}
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

const mapStateToProps = createSelector(selector, ({solutions}) => ({
    solutions,
}));

const mapDispatchToProps = {
    onSelectSolution: actions.showSolution,
};

export default
connect(mapStateToProps, mapDispatchToProps)(render);