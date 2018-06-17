import * as cx from "classnames";
import * as React from "react";
const style = require("./Checkbox.scss");

type Props = {
    className?: string;
    name?: string;
    checked?: boolean;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const Checkbox: React.SFC<Props> = ({children, className, ...rest}) => {
    const className2 = cx(style.checkbox, className);

    return (
        <label className={className2}>
            <input  type="checkbox" {...rest} />
            <span>{children}</span>
        </label>
    );
};

export default Checkbox;
