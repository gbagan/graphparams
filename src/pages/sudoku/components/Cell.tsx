import {cx, withHandlers, React} from "@/commonreact";
const style = require("../css/Cell.scss");

type Props = {
    row: number,
    col: number,
    squaresize: number,
    fixed: boolean;
    value: number;
    selected: boolean;
    onClick: (row: number, col: number) => void
};

type Handlers = {
    handleClick: () => void;
}

const render: React.SFC<Props & Handlers> = ({value, fixed, selected, col, row, squaresize, handleClick}) => {
    const className = cx(style.cell, style["squaresize-" + squaresize], {
        [style.fixed]: fixed,
        [style.selected]: selected,
        [style.hborder]: col % squaresize === 0 && col !== 0,
        [style.vborder]: row % squaresize === 0 && row !== 0,
    });

    return (
        <div className={className} onClick={handleClick}>
            <span>{value === 0 ? "" : value}</span>
        </div>
    );
}

export default
withHandlers<Props, Handlers>({
    handleClick: ({onClick, row, col}) => () => onClick(row, col)
})(render);
