import * as React from "react";
import styled from "styled-components";
import { ifProp } from "styled-tools";

type Props = {
    readonly value: number,
    readonly cols: number,
    readonly onClick: (val: number) => void;
    readonly className?: string;
};

class ConsoleNum extends React.Component<Props> {
    public handleClick = () => this.props.onClick(this.props.value);

    public render() {
        const { value, className } = this.props;
        return (
            <div className={className} onClick={this.handleClick}>
                <span>{value === 0 ? "X" : value}</span>
            </div>
        );
    }
}

export default styled(ConsoleNum)`
    width: ${(props: Props) => props.value === 0 ? 100 : (100 / props.cols)}%;
    color: darkslategray;
    padding: 1px;
    display: inline-block;
    font-weight: bold;
    font-size: 24px;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;
    box-shadow: 0px 0px 0px 1px lightsteelblue;
    &:hover {
        color: white;
        background: ${ifProp({value: 0}, "firebrick", "gold")};
    }
`;
