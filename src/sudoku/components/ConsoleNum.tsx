import * as classNames from "classnames";
import * as React from "react";
const style = require("./Console.scss");

type Props = {
    readonly value: number,
    readonly cols: number,
    readonly onClick: (val: number) => void;
    readonly className?: string;
};

class ConsoleNum extends React.Component<Props> {
    public handleClick = () => this.props.onClick(this.props.value);

    public render() {
        const { cols, value } = this.props;
        const className = classNames(style.num, style["cols-" + cols], {delete: value === 0});
        return (
            <div className={className} onClick={this.handleClick}>
                <span>{value === 0 ? "X" : value}</span>
            </div>
        )
    }
}

export default ConsoleNum;

// width: ${p => p.value === 0 ? 100 : (100 / p.cols)}%;

