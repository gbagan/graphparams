import * as React from 'react';
import * as classNames from 'classnames';

type Props = {
    readonly row: number,
    readonly col: number,
    readonly squaresize: number,
    readonly fixed: boolean;
    readonly value: number;
    readonly selected: boolean;
    readonly onClick: (row: number, col: number) => void
}

const Output: React.SFC<Props> = props => {
    const { row, col, squaresize, fixed, value, selected, onClick } = props;
    const gridsize = squaresize * squaresize;

    const className = classNames('cell', {
                                    selected, fixed,
        border_h: col % squaresize === 0 && col !== 0,
        border_v: row % squaresize === 0 && row !== 0,
    });
    const style = {
        width: (100 / gridsize).toString() + "%",
        height: (100 / gridsize).toString() + "%"
    }   
        
    return (
        <div className={className} style={style} onClick={() => onClick(row, col)}>
            { value > 0 && <span>{value}</span>  }
        </div>
    )
}

export default Output;