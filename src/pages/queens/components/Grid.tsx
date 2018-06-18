import { compose, connect, createSelector, cxbind, React, withStateHandlers } from "@/commonreact";
import * as R from "ramda";
import {actions, selector} from "../redux";
import {squaresBetweenConflicts} from "../util";
import Square from "./Square";
const style = require("../css/style.scss");
const cx = cxbind(style);

type Props = {
    init?: boolean;
}

const mapStateToProps = createSelector(selector,
    ({size, queens}) => ({size, queens}),
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
                        ({ init, size, queens, hoverQueen, onDropQueen, showBetweenSquares }) => {
    if (size === 0)
        return <div/>;

    const className = cx("grid", "size-" + size, {init});

    const rows = init ? 1 : size;

    const betweenConflictsList = hoverQueen === -1
                            ? []
                            : squaresBetweenConflicts(queens[hoverQueen], queens);

    return (
        <div className={className}>
        {
            R.times(key => {
                const row = init ? -1 : Math.floor(key / size);
                const col = key % size;
                const queen = R.findIndex(R.equals({row, col}), R.project(["row", "col"], queens));
                const betweenConflicts = R.contains({row, col}, betweenConflictsList);
                const inConflict = queen !== -1 && queens[queen].inConflict;
                return <Square
                    {...{key, row, col, inConflict, queen, onDropQueen}}
                    onQueenHover={showBetweenSquares}
                    selectedWarning={betweenConflicts}
                    />;
            }, rows * size)
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
