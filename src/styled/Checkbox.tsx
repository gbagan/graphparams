import * as classNames from "classnames";
import * as React from "react";
const style = require("./Checkbox.scss");

type Props = {
    checked?: boolean;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
};

const Checkbox: React.SFC<Props> = props => {
    const {children, className, ...rest} = props;
    const className2 = classNames(style.checbox, className);

    return (
        <label className={className2}>
            <input type="checkbox" {...rest} />
            <span>{children}</span>
        </label>
    );
};

export default Checkbox;
