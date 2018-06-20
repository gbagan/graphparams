import { compose, connect, createSelector, cxbind, React, withHandlers, withStateHandlers } from "@/commonreact";
import * as R from "ramda";
import {actions, selector} from "../redux";
import {PieceType, Position} from "../types";
import Square from "./Square";
const style = require("../css/style.scss");
const cx = cxbind(style);
import {canCapture} from "../util";

type Props = {
    selectedPiece: PieceType;
    help: boolean;
};

const mapStateToProps = createSelector(selector,
    ({rows, columns, pieces, capturableSquares, customLegalMoves}) => ({rows, columns, pieces, capturableSquares, customLegalMoves})
);

const mapDispatchToProps = {
    onSquareClick: actions.putPiece,
};

type ConnectedProps = Props & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

type State = {
    hoverSquare: Position | null;
    cursorPosition: {x: number, y: number} | null;
}

type StateHandlers = {
    handleSquareHover: (p: Position | null) => Partial<State>;
    handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => Partial<State>;
    handleMouseOut: (e: React.MouseEvent<HTMLDivElement>) => Partial<State>;
};

type Handlers = {
    handleSquareClick: (row: number, col: number) => void;
}

type AllProps = ConnectedProps & State & StateHandlers & Handlers;

const render: React.SFC<AllProps> = ({ rows, columns, pieces, selectedPiece, capturableSquares, customLegalMoves,
                                       hoverSquare, help, handleSquareClick,  handleSquareHover,
                                       handleMouseMove, handleMouseOut, cursorPosition,
                                    }) => {
    if (rows === 0 || columns === 0)
        return <div/>;

    const className = cx("grid", "rows-" + rows, "cols-" + columns, {help});

    /*
    const betweenConflictsList = hoverQueen === -1
                            ? []
                            : squaresBetweenConflicts(queens[hoverQueen], queens);
    */

    return (
        <div className={className} onMouseMove={handleMouseMove} onMouseOut={handleMouseOut}>
        {
            R.times(key => {
                const row = Math.floor(key / columns);
                const col = key % columns;
                const pieceIndex = R.findIndex(R.equals({row, col}), R.project(["row", "col"], pieces));
                const pieceType = pieceIndex === -1 ? null : pieces[pieceIndex].type;
                const capturable = R.contains({row, col}, capturableSquares);
                const selected = !!hoverSquare &&
                       (R.equals({row, col}, hoverSquare)
                         || canCapture({...hoverSquare, type: selectedPiece}, {row, col}, customLegalMoves)
                        )
                // const betweenConflicts = R.contains({row, col}, betweenConflictsList);
                // const inConflict = queen !== -1 && queens[queen].inConflict;
                return <Square // onClick={handleSquareClick}
                    {...{key, row, col, pieceType, capturable, selected}}
                    onClick={handleSquareClick} onHover={handleSquareHover}
                    // selectedWarning={betweenConflicts}
                    />;
            }, rows * columns)
        }
        { cursorPosition &&  <div className={cx("piece", "cursor", selectedPiece)}
                    style={{left: cursorPosition.x, top: cursorPosition.y}} />
        }
        </div>
    );
};

export default
compose<AllProps, Props>(
    connect(mapStateToProps, mapDispatchToProps),
    withStateHandlers<State, StateHandlers, ConnectedProps>({
        hoverSquare: null,
        cursorPosition: null,
    }, {
        handleSquareHover: () => p => ({hoverSquare: p}),
        handleMouseMove: () => e => ({
            cursorPosition:  {x: e.clientX - e.target.offsetLeft, y: e.clientY - e.target.offsetTop},
        }),
        handleMouseOut: () => () => ({cursorPosition: null}),
    }),
    withHandlers<State & StateHandlers & ConnectedProps, Handlers>({
        handleSquareClick: ({onSquareClick, selectedPiece}) => (row, col) =>
                                     onSquareClick({row, col, type: selectedPiece}),
    })
)(render);
