import {compose, cx, React, toClass} from "@/commonreact";
import { ConnectDragSource , DragSource,  DragSourceCollector, DragSourceSpec} from "react-dnd";

const style = require("../css/queens.scss");

type Props = {
    id: number;
    error: boolean;
};

const spec: DragSourceSpec<Props> = {
    beginDrag: ({id}) => ({id}),
};

type DragProps = {
    connectDragSource?: ConnectDragSource;
    isDragging?: boolean;
};

const collect: DragSourceCollector = (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
});

const render: React.SFC<Props & DragProps> = ({error, connectDragSource, isDragging}) => {
    const className = cx({
                        [style.queen]: true,
                        [style.error]: error,
                        [style.drag]: isDragging,
                     });
    return connectDragSource!(
        <div className={className}>
            ♛
        </div>
    );
};

export default
compose<Props, Props>(
    DragSource("queen", spec, collect),
    toClass,
)
(render);
