import {cx, React, withHandlers} from "@/commonreact";
import {Position} from "../types";

const style = require("../css/style.scss");

type Props = {
    color: number;
    solution: number;
    row: number;
    column: number;
    columns: number;
    rows: number;
    onClick: (p: Position) => void
};

type Handlers = {
    handleClick: () => void;
}

const render: React.SFC<Props & Handlers> = ({color, solution, columns, rows, handleClick}) => {
    const className = cx(style.cell, style["color-" + color]);

    const style2 = {
        width: (100 / columns) + "%",
        height: (100 / rows) + "%"
    }
    return (
        <div className={className} style={style2} onClick={handleClick}>
            <span>{solution > 0 ? "✖" : "" }</span>
        </div>
    );
}

export default
withHandlers<Props, Handlers>({
    handleClick: ({onClick, row, column}) => () => onClick({row, column})
})(render);