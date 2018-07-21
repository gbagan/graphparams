import {cxbind, React, withHandlers} from '@/commonreact';
import style from '../css/Cell.scss';
const cx = cxbind(style);

const render = ({value, fixed, selected, col, row, squaresize, handleClick}) => {
    const className = cx("cell", "squaresize-" + squaresize, {
            fixed,
            selected,
            hborder: col % squaresize === 0 && col !== 0,
            vborder: row % squaresize === 0 && row !== 0,
    });

    return (
        <div className={className} onClick={handleClick}>
            <span>{value === 0 ? "" : value}</span>
        </div>
    );
}

export default
withHandlers({
    handleClick: ({onClick, row, col}) => () => onClick(row, col)
})(render);
