import * as React from 'react';
import * as classNames from 'classnames';

interface Props {
    readonly row: number,
    readonly col: number,
    readonly squaresize: number,
    readonly fixed?: boolean;
    readonly value?: Number;
    readonly selected?: boolean;
    readonly onClick?: (row: number, col: number) => void
}

export default class Output extends React.Component<Props, {}> {
    render() {
        const { row, col, squaresize, fixed, value, selected, onClick } = this.props;
        const gridsize = squaresize * squaresize;

        const onClick2 = onClick ? () => onClick(row, col) : undefined;

        const className = classNames('cell', {
                                    selected: selected,
                                    fixed: fixed,
                                    border_h: col % squaresize === 0 && col !== 0,
                                    border_v: row % squaresize === 0 && row !== 0,
                                });
        const style = {
            width: (100 / gridsize).toString() + "%",
            height: (100 / gridsize).toString() + "%"
        }

        return (
            <div className={className} style={style} onClick={onClick2}>
                { value !== undefined && value > 0 && <span>{value}</span>  }
            </div>
        );
    }

    handleClick() {
        const {onClick, row, col} = this.props;
        if (onClick !== undefined) {
            onClick(row, col);
        }
    }
}