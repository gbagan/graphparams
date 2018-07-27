import {cxbind, React, withHandlers} from '@/commonreact';
import style from '../css/ConsoleNum.scss';
const cx = cxbind(style);

const ConsoleNum = ({cols, value, handleClick}) => (
    <div
        className={cx('num', 'cols-' + cols, {delete: value === 0})}
        onClick={handleClick}
    >
        <span>{value === 0 ? 'X' : value}</span>
    </div>
);

export default
withHandlers({
    handleClick: props => () => props.onClick(props.value)
})(ConsoleNum);
