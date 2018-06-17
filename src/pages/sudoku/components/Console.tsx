import * as R from "ramda";
import * as React from "react";
import ConsoleNum from "./ConsoleNum";
const style = require("../css/Console.scss");

type Props = {
    readonly cols: number;
    readonly onClick: (val: number) => void;
};

const render: React.SFC<Props> = ({ cols, onClick }) => (
    <div className={style.container}>
        <div className={style.console}>
        {
            R.range(1, cols * cols + 1).concat(0).map(i =>
                <ConsoleNum key={i} value={i} cols={cols} onClick={onClick} />
            )
        }
        </div>
    </div>
);

export default render;
