import * as React from 'react';
import { connect } from 'react-redux';

import { State as RootState } from '../redux/reducers';
import * as actions from "../redux/actions";
import { Position, PosAndVal, ModelCell } from '../types';
import Cell from "./cell";
import Console from "./console";

interface Props {
    readonly squaresize: number;
    readonly cells: ReadonlyArray<ModelCell> | null;
    readonly onCellFilled: (p: PosAndVal) => any;
}

interface State {
    showConsole: boolean;
    readonly selectedCell: Position | null;
}

class Grid extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showConsole: false,
            selectedCell: null
        }
    }

    render() {
        const { squaresize, cells } = this.props;
        const { showConsole, selectedCell } = this.state;
        const size = squaresize * squaresize;
        const divsize = Math.min(800, 40 * size + 10);

        if (cells === null)
            return <div></div>
        else
            return (
                <div className="grid-container">
                    <div className="grid" style={{ width: divsize, height: divsize }}>
                        {
                            cells.map((cell, key) => {
                                const row = Math.floor(key / size);
                                const col = key % size;
                                const { value, fixed } = cell;
                                return (
                                    <Cell key={key} row={row} col={col} value={value} fixed={fixed}
                                        squaresize={squaresize} onClick={this.handleCellClick}
                                        selected={selectedCell !== null && row === selectedCell.row
                                            && col === selectedCell.col} />
                                )
                            })
                        }
                        {showConsole && (<Console cols={squaresize} onClick={this.handleConsoleClick} />)}
                    </div>
                </div>
            );
    }

    readonly handleCellClick = (row: number, col: number) =>
        this.setState({ selectedCell: { row, col }, showConsole: true });


    readonly handleConsoleClick = (value: number) => {
        const { onCellFilled } = this.props;
        const { selectedCell } = this.state;
        if (selectedCell === null)
            return;
        const { row, col } = selectedCell;
        this.setState({
            selectedCell: null,
            showConsole: false
        });
        onCellFilled && onCellFilled({ row, col, value });
    }
}

const mapStateToProps = (state: RootState) => ({
    squaresize: state.squaresize,
    cells: state.cells
});

const mapDispatchToProps = {
    onCellFilled: actions.fillCell
}

export default connect(mapStateToProps, mapDispatchToProps)(Grid)