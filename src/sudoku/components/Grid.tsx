import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import styled from "styled-components";

import * as actions from "../redux/actions";
import selector from "../redux/selector";
import { Position } from "../types";
import Cell from "./Cell";
import Console from "./Console";

const mapStateToProps = createSelector(selector, state => ({
    cells: state.cells,
    squaresize: state.squaresize,
}));

const mapDispatchToProps = {
    onCellFilled: actions.fillCell,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & { className?: string };

type State = {
    showConsole: boolean;
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
        if (!selectedCell) {
            return;
        }
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

        return (
            <div className={this.props.className}>
                {ccells}
                {showConsole && <Console cols={squaresize} onClick={this.handleConsoleClick} />}
            </div>
        );
    }
}

const styledGrid = styled(Grid).attrs<Props>({
    divsize: (props: Props) => Math.min(800, 40 * props.squaresize * props.squaresize + 10),
})`
width: ${(p: any) => p.divsize}px;
height: ${(p: any) => p.divsize}px;
margin: 6px auto;
overflow: hidden;
user-select: none;
box-shadow: 0px 0px 5px 5px #bdc3c7;
position: relative;
`;

export default connect(mapStateToProps, mapDispatchToProps)(styledGrid);
