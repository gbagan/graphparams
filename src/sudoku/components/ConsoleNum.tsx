import * as React from 'react';
import * as classNames from 'classnames';

interface Props {
    readonly value: number,
    readonly cols: number,
    readonly onClick?: (val: number) => void
}

const ConsoleNum: React.SFC<Props> = (props) => {
    const { value, cols, onClick } = props;
    const onclick2 = onClick ? () => onClick(value) : undefined;
    const className = classNames("num", { remove: value === 0 })

    const style = {
        width: value === 0 ? "100%" : (100 / cols).toString() + "%"
    }

    return (
        <div className={className} style={style} onClick={onclick2}>
            <span>{value === 0 ? "X" : value} </span>
        </div>
    );
}

export default ConsoleNum