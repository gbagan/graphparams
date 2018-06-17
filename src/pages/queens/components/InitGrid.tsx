import { connect, createSelector, cx, React } from "@/commonreact";
import * as R from "ramda";

import {actions, selector} from "../redux";
import Cell from "./Cell";

const style = require("../css/queens.scss");

const mapStateToProps = createSelector(selector,
    ({size, queens}) => ({size, queens}),
);

const mapDispatchToProps = {
    onDropQueen: actions.moveQueen,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const render: React.SFC<Props> = ({ size, queens, onDropQueen }) => {
    if (size === 0)
        return <div/>;

    const className = cx(style.grid, style["size-" + size], style.init);

    return (
        <div className={className}>
        {
            R.times(key => {
                const row = -1;
                const col = key % size;
                const queen = R.findIndex(R.equals({row, col}), R.project(["row", "col"], queens));
                const error = false;
                return <Cell {...{key, row, col, error, size, queen, onDropQueen}} />;
            }, size)
        }
        </div>
    );
}

export default
    connect(mapStateToProps, mapDispatchToProps)
(render);