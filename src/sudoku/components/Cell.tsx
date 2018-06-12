import * as classNames from "classnames";
import * as React from "react";
const style = require("./Cell.scss");

type Props = {
    readonly row: number,
    readonly col: number,
    readonly squaresize: number,
    readonly fixed: boolean;
    readonly value: number;
    readonly selected: boolean;
    readonly onClick: (row: number, col: number) => void
    readonly className?: string;
};

export default class Cell extends React.Component<Props> {
    public handleClick = () => this.props.onClick(this.props.row, this.props.col);

    public render() {
        const {value, fixed, selected, col, row, squaresize} = this.props;
        const className = classNames(style.cell, {
            [style.fixed]: fixed,
            [style.selected]: selected,
            [style.border_h]: col % squaresize === 0 && col !== 0,
            [style.border_v]: row % squaresize === 0 && row !== 0,
        });

        return (
            <div className={className} onClick={this.handleClick}>
                <span>{value === 0 ? "" : value}</span>
            </div>
        );
    }
}
