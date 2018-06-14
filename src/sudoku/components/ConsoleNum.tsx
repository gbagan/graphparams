import * as classNames from "classnames";
import * as React from "react";
import {withHandlers} from "recompose";
const style = require("./ConsoleNum.scss");

type Props = {
    readonly value: number,
    readonly cols: number,
    readonly onClick: (val: number) => void;
};

type HandlerProps = {
    handleClick: () => void;
}


const render: React.SFC<Props & HandlerProps> = ({cols, value, handleClick}) => {
    const className = classNames(style.num,
                                 style["cols-" + cols],
                                 {[style.delete]: value === 0}
                                );
    return (
        <div className={className} onClick={handleClick}>
            <span>{value === 0 ? "X" : value}</span>
        </div>
    )
};

export default
withHandlers<Props, HandlerProps>({
    handleClick: ({onClick, value}) => () => onClick(value)
})
(render);
