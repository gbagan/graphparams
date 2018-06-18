import { compose, connect, createSelector, cxbind, React } from "@/commonreact";
import {selector} from "../redux";
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

const render: React.SFC<ConnectedProps> = ({ columns, pegs, holes, rows }) => {
    if (columns === 0 || rows === 0)
        return <div/>;

    const className = cx("grid", "rows-" + rows, "cols-" + columns);

    return (
        <div className={className}>
        {
            holes.map(({row, col}, i) => {
                const hasPeg = false;
                return <Hole key={"hole-" + i} row={row} col={col} hasPeg={hasPeg} />
            }).concat(
                pegs.map(({row, col, id}) => (
                    <Peg key={"peg-" + id} id={id} row={row} col={col} />
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
