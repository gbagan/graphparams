import * as R from "ramda";
import {compose, cxbind, React, toClass} from "@/commonreact";
import { ConnectDropTarget, DropTarget} from "react-dnd";
const style = require("../css/style.scss");
const cx = cxbind(style);

type Props = {
    row: number,
    col: number,
    onDropPeg: (p: {id: number, row: number, col: number}) => void;
};

type DropProps = {
    connectDropTarget?: ConnectDropTarget;
    isOver?: boolean;
    canDrop?: boolean;
};

const render: React.SFC<Props & DropProps> = ({row, col,
                                               connectDropTarget}) => {
    const className = cx("hole",  "row-" + row, "col-" + col);

    return (
        connectDropTarget!(
            <div className={className}/>
        )
    );
};

export default
compose<Props, Props>(
    DropTarget<Props>(
        "peg",
        {
            canDrop: ({row, col}, monitor) => !!monitor && R.contains(({row, col}), monitor.getItem()["reachableHoles"]),
            drop: ({row, col, onDropPeg}, monitor) => {
                const id = monitor!.getItem()["id"];
                onDropPeg({id, row, col});
            },
        },
        (connect, monitor) => ({
            canDrop: monitor.canDrop(),
            connectDropTarget: connect.dropTarget(),
            isOver: monitor.isOver(),
        })
    ),
    toClass,
)(render);
