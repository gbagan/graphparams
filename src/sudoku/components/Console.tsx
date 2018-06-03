import * as React from "react";
import styled from "styled-components";

import {range} from "../../lib/iter";
import ConsoleNum from "./ConsoleNum";

type Props = {
    readonly cols: number;
    readonly onClick: (val: number) => void;
};

const ConsoleContainer = styled.div`
    background-color: rgba(127, 140, 141, 0.7);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    user-select: none;
`;

const Console = styled.div`
    display: block;
    position: absolute;
    width:50%;
    color:white;
    background-color: rgba(127, 140, 141, 0.7);
    box-shadow: 0px 0px 5px 5px #bdc3c7;
`;

export default (props: Props) => {
    const { cols, onClick } = props;

    const nums = [...range(1, cols * cols + 1)].concat(0).map(i =>
        <ConsoleNum key={i} value={i} cols={cols} onClick={onClick} />);

    return (
        <ConsoleContainer>
            <Console>
                {nums}
            </Console>
        </ConsoleContainer>
    );
};
