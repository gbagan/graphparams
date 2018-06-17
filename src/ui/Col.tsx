import * as React from "react";
import * as cx from "classnames";

const style = require("./Col.scss");

type Props = {
    className?: string;
    span?: number
}

const render: React.SFC<Props> = ({className, children, span}) => (
    <div className={cx(style.col,
                       span && style["span-" + span],
                       className
                      )}
    >
        {children}
    </div>
)

export default render;