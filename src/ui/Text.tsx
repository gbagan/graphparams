import * as cx from "classnames";
import * as React from "react";
const style = require("./Text.scss");

type Props = {
    color?: "warning" | "error";
    className?: string;
};

const Text: React.SFC<Props> = ({color, className, children}) => {
    const className2 = cx(style.text, {
                         [style.warning]: color === "warning",
                         [style.error]: color === "error"
                        }, className);
    return <span className={className2}>{children}</span>;
}

export default Text;