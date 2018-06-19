import { compose, connect, cxbind, React, withHandlers } from "@/commonreact";
import {Board} from "../types";
import {actions} from "../redux";
const style = require("../css/style.scss");
const cx = cxbind(style);

type Props = Board;

const mapStateToProps = () => ({});
const mapDispatchToProps = {
    load: actions.load,
};

type ReduxProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

type Handlers = {
    handleClick: () => void;
}

const render: React.SFC<Props & Handlers> = ({ columns, pegs, holes, rows, handleClick}) => {
    if (columns === 0 || rows === 0)
        return <div/>;

    const className = cx("grid", "mini", "rows-" + rows, "cols-" + columns);

    return (
        <div onClick={handleClick} className={className}>
        {
            holes.map(({row, col}, i) => (
                <div key={"hole" + i} className={cx("hole", "row-" + row, "col-" + col)}/>
            )).concat(
                pegs.map(({row, col, id}
                ) => (
                    <div key={"peg" + id} className={cx("peg", "row-" + row, "col-" + col)}/>
                ))
            )
        }
        </div>
    );
};
export default
compose<Props & Handlers, Props>(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers<Props & ReduxProps, Handlers>({
        handleClick: ({load, rows, columns, holes, pegs}) => () => load({rows, columns, holes, pegs}),
    })
)(render);
