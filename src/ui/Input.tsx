import * as cx from "classnames";
import * as React from "react";
const style = require("./Input.scss");

type Props = {
    className?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const render: React.SFC<Props> = ({className, children, ...rest}) => (
    <input type="text" {...rest} className={cx(style.input, className)}>
        {children}
    </input>
)

export default render;
