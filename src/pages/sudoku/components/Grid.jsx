import {compose, connect, createSelector, cxbind, React, withHandlers, withStateHandlers} from '@/commonreact';

import {actions, selector} from '../redux';
import Cell from './Cell';
import Console from './Console';
import style from '../css/Grid.scss';
const cx = cxbind(style);

const render = ({squaresize, cells, isConsoleShowed, selectedCell, handleCellClick, handleConsoleClick }) => {
    const size = squaresize * squaresize;
    const className = cx('grid', 'squaresize-' + squaresize);

    if (!cells) {
        return <div />;
    }

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
            {isConsoleShowed && <Console cols={squaresize} onClick={handleConsoleClick} />}
        </div>
    );
};

const mapStateToProps = createSelector(selector,
    ({cells, squaresize}) => ({cells, squaresize})
);

const mapDispatchToProps = {
    onCellFilled: actions.fillCell,
};

export default
compose(
    connect(mapStateToProps, mapDispatchToProps),
    withStateHandlers(
        {
            isConsoleShowed: false,
            selectedCell: null,
        },
        {
            hideConsole: state => () =>  ({ selectedCell: null, isConsoleShowed: false }),
            showConsole: state => (row, col) => ({ selectedCell: {row, col}, isConsoleShowed: true }),
        }
    ),
    withHandlers({
        handleCellClick: ({ showConsole }) =>
            (row, col) => showConsole(row, col),
        handleConsoleClick: ({selectedCell, hideConsole, onCellFilled}) => value => {
            if (!selectedCell)
                return;
            const {row, col} = selectedCell;
            onCellFilled({ row, col, value });
            hideConsole();
        }
    }),
)(render);
