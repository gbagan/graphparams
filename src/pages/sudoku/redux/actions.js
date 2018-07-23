import {createAction} from '@/commonreact';

const actions = {
    selectCell: createAction('eds/SELECT-CELL'),
    fillCell: createAction('eds/FILL-CELL'),
    selectExample: createAction('eds/SELECT-EXAMPLE'),
    selectGrid: createAction('eds/SELECT-GRID'),
    showSolution: createAction('eds/SHOW-SOLUTION'),
    solve: createAction('sudoku/SOLVE'),
};

export default actions;
