import * as classNames from "classnames";
import * as React from "react";
const style = require("./Row.scss");

type Props = {
//    justify?: string;
//    align?: string;
    gutter?: number;
    className?: string;
};

const Row: React.SFC<Props> = props => {
    const {gutter, className, children} = props;

    const className2 = classNames(style.row, gutter && style["gutter-" + gutter]
    , className);

    return <div className={className2}>{children}</div>
}

export default Row;