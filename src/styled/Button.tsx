import * as classNames from "classnames";
import * as React from "react";

const style = require("./Button.scss");

type Props = {
    large?: boolean;
    color?: "primary" | "danger";
    small?: boolean;
    disabled?: boolean;
    onClick?: any; ////////////////////
    className?: string;
};

const Button: React.SFC<Props> = props => {
    const {large, color, small, children, className, ...rest} = props;

    const className2 = classNames(style.button, {
        [style.primary]: color === "primary",
        [style.danger]: color === "danger",
        [style.large]: large !== undefined,
        [style.small]: small !== undefined,
    }, className);

    return <button className={className2} {...rest}>{children}</button>
}

export default Button;
