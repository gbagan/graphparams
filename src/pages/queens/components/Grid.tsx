import { compose, connect, createSelector, cxbind, React, withStateHandlers } from "@/commonreact";
import * as R from "ramda";
import {actions, selector} from "../redux";
import {PieceType} from "../types";
import Square from "./Square";
const style = require("../css/style.scss");
const cx = cxbind(style);

type Props = {
    selectedPiece: PieceType;
};

const mapStateToProps = createSelector(selector,
    ({rows, columns, pieces}) => ({rows, columns, pieces})
);

const mapDispatchToProps = {
    onDropQueen: actions.moveQueen,
};

type State = {
    hoverQueen: number;
}

type StateHandlers = {
    showBetweenSquares: (id: number) => Partial<State>;
}

type ConnectedProps = Props & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;
type AllProps = ConnectedProps & State & StateHandlers;

const render: React.SFC<AllProps> =
                        ({ rows, columns, pieces, onDropQueen, showBetweenSquares }) => {
    if (rows === 0 || columns === 0)
        return <div/>;

    const className = cx("grid", "rows-" + rows, "cols-" + columns);

    /*
    const betweenConflictsList = hoverQueen === -1
                            ? []
                            : squaresBetweenConflicts(queens[hoverQueen], queens);
    */

    return (
        <div className={className}>
        {
            R.times(key => {
                const row = Math.floor(key / columns);
                const col = key % columns;
                const pieceIndex = R.findIndex(R.equals({row, col}), R.project(["row", "col"], pieces));
                const pieceType = pieceIndex === -1 ? null : pieces[pieceIndex].type;
                // const betweenConflicts = R.contains({row, col}, betweenConflictsList);
                // const inConflict = queen !== -1 && queens[queen].inConflict;
                return <Square // onClick={handleSquareClick}
                    {...{key, row, col, pieceType}}
                    // selectedWarning={betweenConflicts}
                    />;
            }, rows * columns)
        }
        </div>
    );
}

export default
compose<AllProps, Props>(
    connect(mapStateToProps, mapDispatchToProps),
    withStateHandlers<State, StateHandlers, ConnectedProps>({
        hoverQueen: -1,
    }, {
        showBetweenSquares: () => id => ({hoverQueen: id}),
    }),
)(render);
