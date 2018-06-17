import {cx, React, withHandlers} from "@/commonreact";
const style = require("../css/ConsoleNum.scss");

type Props = {
    readonly value: number,
    readonly cols: number,
    readonly onClick: (val: number) => void;
};

type Handlers = {
    handleClick: () => void;
}

const render: React.SFC<Props & Handlers> = ({cols, value, handleClick}) => {
    const className = cx(style.num,
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
withHandlers<Props, Handlers>({
    handleClick: ({onClick, value}) => () => onClick(value)
})
(render);
