import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import {compose, withHandlers, withStateHandlers} from "recompose";
import { createSelector } from "reselect";

import * as actions from "../redux/actions";
import selector from "../redux/selector";
import { Position } from "../types";
import Cell from "./Cell";
import Console from "./Console";

const style = require("./Grid.scss");

const mapStateToProps = createSelector(selector,
    ({cells, squaresize}) => ({cells, squaresize})
);

const mapDispatchToProps = {
    onCellFilled: actions.fillCell,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

type State = {
    readonly isConsoleShowed: boolean;
    readonly selectedCell: Position | null;
};

type HandlerProps = {
    handleCellClick: (row: number, col: number) => void;
    handleConsoleClick: (n: number) => void;
}

type StateHandlerProps = {
    showConsole: (row: number, col: number) => Partial<State>;
    hideConsole: () => Partial<State>;
}

const render: React.SFC<Props & State & HandlerProps> =
    ({squaresize, cells, isConsoleShowed, selectedCell, handleCellClick, handleConsoleClick }) => {
    const size = squaresize * squaresize;
    const className = classNames(style.grid, style["squaresize-"+squaresize]);
    
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
}

export default
compose<Props & State & HandlerProps, {}>(
    connect(mapStateToProps, mapDispatchToProps),
    withStateHandlers<State,StateHandlerProps,Props>(
        {
            selectedCell: null,
            isConsoleShowed: false,
        },
        {
            showConsole: state => (row, col) => ({ selectedCell: {row, col}, isConsoleShowed: true }),
            hideConsole: state => () =>  ({ selectedCell: null, isConsoleShowed: false })
        }
    ),
    withHandlers<Props & State & StateHandlerProps, HandlerProps>({
        handleCellClick: ({ showConsole }) =>
            (row, col) => showConsole(row, col),
        handleConsoleClick: ({selectedCell, hideConsole, onCellFilled}) => value => {
            if (!selectedCell)
                return;
            const {row, col} = selectedCell;
            onCellFilled({ row, col, value });
            hideConsole();
        }
    })
)(render);
