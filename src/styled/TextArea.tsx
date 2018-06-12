import * as classNames from "classnames";
import * as React from "react";
const style = require("./TextArea.scss");

type Props = {
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
    value?: string;
}

const TextArea: React.SFC<Props> = props => {
    const {className, ...rest} = props;
    return (
        <textarea {...rest} className={classNames(style.textarea, className)}>
            {props.children}
        </textarea>
    )
}

export default TextArea;
