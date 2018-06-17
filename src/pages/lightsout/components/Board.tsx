import {connect, createSelector, React} from "@/commonreact";
import {actions, selector} from "../redux";

import Cell from "./Cell";

const style = require("../css/style.scss");

const mapStateToProps = createSelector(selector,
    ({board, columns, rows, currentSolution}) => ({board, columns, rows, currentSolution})
);

const mapDispatchToProps = {
    onSwitchCell: actions.switchCell,
};


type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const render: React.SFC<Props> = ({board, columns, rows, currentSolution, onSwitchCell }) => {
    const className = style.board;

    const style2 = {
        height: (40 * rows) + "px",
        width: (40 * columns) + "px",
    }

    if (!board) {
        return <div />;
    }

    return (
        <div className={className} style={style2}>
        {
            board.map((color, i) => (
                <Cell
                    key={i}
                    color={color}
                    row={Math.floor(i / columns)}
                    column={i % columns}
                    rows={rows}
                    columns={columns}
                    solution={currentSolution ? currentSolution[i] : 0}
                    onClick={onSwitchCell}
                />
            ))
        }
        </div>
    );
};

export default
connect(mapStateToProps, mapDispatchToProps)
(render);
