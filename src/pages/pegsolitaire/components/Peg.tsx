import {compose, cxbind, React, toClass} from "@/commonreact";
import {ConnectDragSource , DragSource} from "react-dnd";

const style = require("../css/style.scss");
const cx = cxbind(style);

import {Position} from "../types";

type Props = {
    id: number;
    row: number;
    col: number;
    reachableHoles: Position[];
};

type DragProps = {
    connectDragSource?: ConnectDragSource;
    isDragging?: boolean;
};

const render: React.SFC<Props & DragProps> =
           ({row, col, isDragging, connectDragSource}) => {
    const className = cx("peg",  "row-" + row, "col-" + col, {drag: isDragging});
    return connectDragSource!(
        <div className={className} />
    );
};

export default
compose<Props, Props>(
    DragSource<Props>(
        "peg",
        {
            beginDrag: ({id, reachableHoles}) => ({id, reachableHoles}),
        },
        (connect, monitor) => ({
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        })
    ),
    toClass,
)
(render);
