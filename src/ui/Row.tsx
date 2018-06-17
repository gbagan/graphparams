import * as cx from "classnames";
import * as React from "react";
const style = require("./Row.scss");

type Props = {
//    justify?: string;
//    align?: string;
    gutter?: number;
    className?: string;
};

const render: React.SFC<Props> = ({gutter, className, children}) => {
    const className2 = cx(style.row,
                          gutter && style["gutter-" + gutter],
                          className);

    return <div className={className2}>{children}</div>
}

export default render;