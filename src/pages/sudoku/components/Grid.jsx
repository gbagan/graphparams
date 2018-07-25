import {connect, createSelector, cxbind, pick, React} from '@/commonreact';

import {actions, selector} from '../redux';
import Cell from './Cell';
import Console from './Console';
import style from '../css/Grid.scss';
const cx = cxbind(style);

const render = ({squaresize, cells, selectedCell, handleCellClick, handleConsoleClick }) => {
    const size = squaresize * squaresize;
    const className = cx('grid', 'squaresize-' + squaresize);

    const ccells = cells.map((cell, key) => {
        const row = Math.floor(key / size);
        const col = key % size;
        const { value, fixed } = cell;
        const selected = !!selectedCell && row === selectedCell.row && col === selectedCell.col;
        return <Cell {...{key, row, col, value, fixed, squaresize, selected, onClick: handleCellClick}} />;
    });

    return (
        <div className={className}>
            {ccells}
            {selectedCell && <Console cols={squaresize} onClick={handleConsoleClick} />}
        </div>
    );
};

const mapStateToProps = createSelector(selector, pick('cells,squaresize,selectedCell'));

const mapDispatchToProps = {
    handleCellClick: actions.selectCell,
    handleConsoleClick: actions.fillCell,
};

export default
connect(mapStateToProps, mapDispatchToProps)(render);
