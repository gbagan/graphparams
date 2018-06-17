import * as cx from "classnames";
import * as React from "react";

const style = require("./Button.scss");

type Props = {
    large?: boolean;
    color?: "primary" | "danger";
    small?: boolean;
    disabled?: boolean;
    className?: string;
    htmlType?: string;
    onClick?: any; ////////////////////
    onMouseOver?: any;
    onMouseOut?: any;
    onMouseEnter?: any;
    onMouseLeave?: any;
};

const render: React.SFC<Props> = ({large, color, small, children, className, htmlType, ...rest}) => {
    const className2 = cx({
                        [style.button]: true,
                        [style.primary]: color === "primary",
                        [style.danger]: color === "danger",
                        [style.large]: large !== undefined,
                        [style.small]: small !== undefined,
                      }, className);

    return (
        <button type={htmlType} className={className2} {...rest}>
            {children}
        </button>
    )
}

export default render;
