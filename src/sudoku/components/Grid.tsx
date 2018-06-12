import * as classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import * as actions from "../redux/actions";
import selector from "../redux/selector";
import { Position } from "../types";
import Cell from "./Cell";
import Console from "./Console";

const style = require("./Grid.scss");

const mapStateToProps = createSelector(selector, state => ({
    cells: state.cells,
    squaresize: state.squaresize,
}));

const mapDispatchToProps = {
    onCellFilled: actions.fillCell,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & { className?: string };

type State = {
    readonly showConsole: boolean;
    readonly selectedCell: Position | null;
};

class Grid extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedCell: null,
            showConsole: false,
        };
    }

    public handleCellClick = (row: number, col: number) =>
        this.setState({ selectedCell: { row, col }, showConsole: true })

    public handleConsoleClick = (value: number) => {
        const { selectedCell } = this.state;
        if (!selectedCell)
            return;
        const { row, col } = selectedCell;
        this.setState({
            selectedCell: null,
            showConsole: false,
        });
        this.props.onCellFilled({ row, col, value });
    }

    public render() {
        const { squaresize, cells } = this.props;
        const { showConsole, selectedCell } = this.state;
        const size = squaresize * squaresize;

        if (!cells) {
            return <div />;
        }

        const ccells = cells.map((cell, key) => {
            const row = Math.floor(key / size);
            const col = key % size;
            const { value, fixed } = cell;
            const selected = !!selectedCell && row === selectedCell.row && col === selectedCell.col;
            const onClick = this.handleCellClick;
            return <Cell {...{key, row, col, value, fixed, squaresize, selected, onClick}} />;
        });

        const className = classNames(style.grid, style["squaresize-"+squaresize]);

        return (
            <div className={className}>
                {ccells}
                 {showConsole && <Console cols={squaresize} onClick={this.handleConsoleClick} />}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
