import {compose, cxbind, React, toClass} from "@/commonreact";
import { ConnectDropTarget, DropTarget} from "react-dnd";
import Queen from "./Queen";
const style = require("../css/style.scss");
const cx = cxbind(style);

type Props = {
    row: number,
    col: number,
    inConflict: boolean;
    selectedWarning: boolean;
    queen: number;
    onQueenHover: (id: number) => void;
    onDropQueen: (p: {id: number; row: number; col: number}) => void;
};

type DropProps = {
    connectDropTarget?: ConnectDropTarget;
    isOver?: boolean;
    canDrop?: boolean;
};

const render: React.SFC<Props & DropProps> = ({row, col, queen, inConflict,
                                               selectedWarning, onQueenHover, connectDropTarget}) => {
    const className = cx({
            square: true,
            black: row !== - 1 && (row + col) % 2 === 0,
            warning: selectedWarning,
    });

    return (
        connectDropTarget!(
            <div className={className}>
                {queen !== -1 && <Queen key={queen} inConflict={inConflict} id={queen} onQueenHover={onQueenHover}/>}
            </div>
        )
    );
};

export default
compose<Props, Props>(
    DropTarget<Props>(
        "queen",
        {
            canDrop: ({queen}) => queen === -1,
            drop: ({onDropQueen, row, col}, monitor) => {
                const id = monitor!.getItem()["id"];
                onDropQueen({id, row, col});
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
