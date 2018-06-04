import * as React from "react";
import styled, {css} from "styled-components";

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

class Cell extends React.Component<Props> {
    public handleClick = () => this.props.onClick(this.props.row, this.props.col);

    public render() {
        const {value} = this.props;

        return (
            <div className={this.props.className} onClick={this.handleClick}>
                <span>{value === 0 ? "" : value}</span>
            </div>
        );
    }
}

export default styled(Cell).attrs<Props>({
            border_h: (props: Props) => props.col % props.squaresize === 0 && props.col !== 0,
            border_v: (props: Props) => props.row % props.squaresize === 0 && props.row !== 0,
            gridsize: (props: Props) => props.squaresize * props.squaresize,
        })`
height: ${(p: any) => 100 / p.gridsize + "%"};
width: ${(p: any) => 100 / p.gridsize + "%"};
cursor: pointer;
text-align: center;
float: left;
box-sizing: border-box;
background: ${p => p.fixed ? "#ecf0f1" : "white"};
& > span {
color: ${p => p.fixed ? "#7f8c8d" : "#2c3e50"};
    font-size: 20px;
    text-align: middle;
}
box-shadow: 0px 0px 0px 1px #bdc3c7
    ${(p: any) => p.border_h && ", inset 2px 0px 0 #34495e"}
    ${(p: any) => p.border_v && ", inset 0px 2px 0 #34495e"};
${p => p.selected && css`
    background: #3498db;
    box-shadow: 0px 0px 3px 3px #bdc3c7;
    & > span {
        color: white;
        font-weight:bold;
    }
`}
`;
