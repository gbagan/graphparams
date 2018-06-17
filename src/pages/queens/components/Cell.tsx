import {compose, cx, React, toClass} from "@/commonreact";
import { ConnectDropTarget, DropTarget, DropTargetCollector, DropTargetSpec} from "react-dnd";
const style = require("../css/queens.scss");

import Queen from "./Queen";

type Props = {
    row: number,
    col: number,
    error: boolean;
    size: number;
    queen: number;
    onDropQueen: (p: {id: number; row: number; col: number}) => void;
};

type DropProps = {
    connectDropTarget?: ConnectDropTarget;
    isOver?: boolean;
    canDrop?: boolean;
};

const render: React.SFC<Props & DropProps> = ({row, col, size, queen, error, connectDropTarget, isOver}) => {
    const className = cx({
            [style.cell]: true,
            [style["size-" + size]]: true,
            [style.black]: (row + col) % 2 === 0,
            [style.selected]: isOver,
    });

    return (
        connectDropTarget!(
            <div className={className}>
                {queen !== -1 && <Queen key={queen} error={error} id={queen}/>}
            </div>
        )
    );
};

const spec: DropTargetSpec<Props> = {
    canDrop: ({queen}) => queen === -1,
    drop: ({onDropQueen, row, col}, monitor) => {
        if (!monitor)
            return;
        const id = (monitor.getItem() as any).id;
        onDropQueen({id, row, col});
    }
};

const collect: DropTargetCollector = (connect, monitor) => ({
    canDrop: monitor.canDrop(),
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
});

export default
compose<Props, Props>(
    DropTarget("queen", spec, collect),
    toClass,
)(render);
