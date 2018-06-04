import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import * as actions from "../redux/actions";
import selector from "../redux/selector";

const mapStateToProps = createSelector(selector, state => ({
    board: state.board,
    columns: state.columns,
    rows: state.rows,
    solution: state.currentSolution,
}));

const mapDispatchToProps = {
    onClick: actions.switchCell,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

class Board extends React.Component<Props> {
    private ref: React.RefObject<HTMLCanvasElement>;

    constructor(props: Props) {
        super(props);
        this.ref = React.createRef();
    }

    public componentDidMount() {
        this.draw();
    }

    public componentDidUpdate() {
        this.draw();
    }

    public render() {
        return <canvas className="board" onClick={this.handleClick} ref={this.ref} />;
    }

    public handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const { rows, columns, board, onClick } = this.props;
        const el = this.ref.current;
        if (!board || !el) {
            return;
        }
        const size = 60;
        const rect = el.getBoundingClientRect();
        const scaleX = el.width / rect.width;
        const scaleY = el.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const xx = Math.floor((x - 25) / size);
        const yy = Math.floor((y - 25) / size);

        if (xx < 0 || xx >= columns || yy < 0 || yy >= rows) {
            return;
        }
        onClick({ row: yy, column: xx });
    }

    private draw() {
        const { rows, columns, board, solution } = this.props;
        const el = this.ref.current;
        if (!el || !board) {
            return;
        }
        const context = el.getContext("2d")!;

        const size = 60;
        const colors = ["green", "yellow", "orange", "red", "violet", "blue"];

        el.height = size * rows + 50;
        el.width = size * columns + 50;

        context.clearRect(0, 0, el.width, el.height);

        const spaceX = 25;
        const spaceY = 25;

        context.fillStyle = "black";
        context.strokeStyle = "black";

        context.beginPath();
        for (let i = 0; i <= rows; i++) {
            context.moveTo(spaceX, spaceY + size * i);
            context.lineTo(spaceX + size * columns, spaceY + size * i);
            context.stroke();
        }
        for (let i = 0; i <= columns; i++) {
            context.moveTo(spaceX + size * i, spaceY);
            context.lineTo(spaceX + size * i, spaceY + size * rows);
            context.stroke();
        }
        context.closePath();

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const position = i * columns + j;
                if (board[position] !== 0) {
                    context.fillStyle = colors[board[position] - 1];
                    context.fillRect(spaceX + size * j + 2, spaceY + size * i + 2, size - 4, size - 4);
                }
            }
        }

        if (solution) {
            context.fillStyle = "black";
            context.beginPath();
            solution.forEach((value, index) => {
                if (value > 0) {
                    const column = index % columns;
                    const row = Math.floor(index / columns);
                    const dx = spaceX + size * column;
                    const dy = spaceY + size * row;
                    context.moveTo(dx + 15, dy + 15);
                    context.lineTo(dx + 45, dy + 48);
                    context.moveTo(dx + 12, dy + 45);
                    context.lineTo(dx + 45, dy + 15);
                    if (value > 1) {
                        context.font = "14pt Calibri";
                        context.fillStyle = "black";
                        context.fillText(value.toString(), dx + 48, dy + 54);
                    }
                    context.stroke();
                    context.closePath();
                }
            });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
