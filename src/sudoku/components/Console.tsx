import * as React from "react";
import {range} from "@/lib/util";
import ConsoleNum from "./ConsoleNum";
const style = require("./Console.scss");

type Props = {
    readonly cols: number;
    readonly onClick: (val: number) => void;
};

const Console: React.SFC<Props> = props => {
    const { cols, onClick } = props;

    return (
        <div className={style.container}>
            <div className={style.console}> {
                range(1, cols * cols + 1).concat(0).map(i =>
                    <ConsoleNum key={i} value={i} cols={cols} onClick={onClick} />
                )
            }
            </div>
        </div>
    )
};

export default Console;
