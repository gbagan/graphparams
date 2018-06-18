import {compose, cxbind, React, toClass, withHandlers} from "@/commonreact";
import {ConnectDragSource , DragSource} from "react-dnd";

const style = require("../css/style.scss");
console.log("style", style);
const cx = cxbind(style);

type Props = {
    id: number;
    inConflict: boolean;
    onQueenHover: (id: number) => void;
};

type Handlers = {
    handleMouseOver: () => void;
    handleMouseOut: () => void;
}

type DragProps = {
    connectDragSource?: ConnectDragSource;
    isDragging?: boolean;
};

const render: React.SFC<Props & Handlers & DragProps> =
           ({inConflict, handleMouseOver, handleMouseOut, connectDragSource, isDragging}) => {
    const className = cx({
                        queen: true,
                        conflict: inConflict,
                        drag: isDragging,
                     });
    return connectDragSource!(
        <div className={className} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} />
    );
};

export default
compose<Props & Handlers, Props>(
    withHandlers<Props, Handlers>({
        handleMouseOver: ({onQueenHover, id}) => () => onQueenHover(id),
        handleMouseOut: ({onQueenHover}) => () => onQueenHover(-1),
    }),
    DragSource<Props>(
        "queen",
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
