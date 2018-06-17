import * as cx from "classnames";
import * as React from "react";
const style = require("./Input.scss");

type Props = {
    className?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const render: React.SFC<Props> = ({className, children, ...rest}) => (
    <textarea {...rest} className={cx(style.input, style.textarea, className)}>
        {children}
    </textarea>
)

export default render;
