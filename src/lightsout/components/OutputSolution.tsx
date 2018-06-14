import * as React from "react";
import {withHandlers} from "recompose";
import { Solution } from "../types";

type Props = {
    index: number,
    solution: Solution,
    onSelect: (solution: Solution | null) => void;
};

type HandlerProps = {
    handleMouseOver: () => void;
    handleMouseOut: () => void;
}

const render: React.SFC<Props & HandlerProps> = ({index, handleMouseOver, handleMouseOut}) =>
    <a href="#" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
        solution {index + 1}
    </a>

export default
withHandlers<Props, HandlerProps>({
    handleMouseOver: ({onSelect, solution}) => () => onSelect(solution),
    handleMouseOut: ({onSelect}) => () => onSelect(null),
})(render)
