import {compose, cxbind, React, toClass} from "@/commonreact";
import {ConnectDragSource , DragSource} from "react-dnd";

const style = require("../css/style.scss");
console.log("style", style);
const cx = cxbind(style);

type Props = {
    id: number;
    row: number;
    col: number;
};

type DragProps = {
    connectDragSource?: ConnectDragSource;
    isDragging?: boolean;
};

const render: React.SFC<Props & DragProps> =
           ({row, col, isDragging, connectDragSource}) => {
    const className = cx("hole",  "row-" + row, "col-" + col, {drag: isDragging});
    return connectDragSource!(
        <div className={className} />
    );
};

export default
compose<Props, Props>(
    DragSource<Props>(
        "peg",
        {
            beginDrag: p => ({id: p.id}),
        },
        (connect, monitor) => ({
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        })
    ),
    toClass,
)
(render);
