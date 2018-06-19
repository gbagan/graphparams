import { compose, connect, createSelector, cxbind, React } from "@/commonreact";
import {actions, selector} from "../redux";
import Hole from "./Hole";
import Peg from "./Peg";
const style = require("../css/style.scss");
const cx = cxbind(style);

type Props = {
}

const mapStateToProps = createSelector(selector,
    ({rows, columns, pegs, holes}) => ({rows, columns, pegs, holes}),
);

const mapDispatchToProps = {
    handleDropPeg: actions.movePeg,
};

/*
type State = {
    hoverQueen: number;
}

type StateHandlers = {
    showBetweenSquares: (id: number) => Partial<State>;
}

*/

type ConnectedProps = Props & ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;
// type AllProps = ConnectedProps & State & StateHandlers;

const render: React.SFC<ConnectedProps> = ({ columns, pegs, holes, rows, handleDropPeg }) => {
    if (columns === 0 || rows === 0)
        return <div/>;

    const className = cx("grid", "rows-" + rows, "cols-" + columns);

    return (
        <div className={className}>
        {
            holes.map(({row, col}, i) => {
                return <Hole key={"hole-" + i} row={row} col={col} onDropPeg={handleDropPeg} />
            }).concat(
                pegs.map(({row, col, id, reachableHoles}) => (
                    <Peg key={"peg-" + id} {...{id, row, col, reachableHoles}} />
                ))
            )
        }
        </div>
    );
}

export default
compose<ConnectedProps, Props>(
    connect(mapStateToProps, mapDispatchToProps),
)(render);
