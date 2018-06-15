import * as React from "react";
import {withHandlers} from "recompose";
import {Solution} from "../types";


type Props = {
    index: number,
    solution: Solution,
    onSelect: (solution: Solution | null) => void;
};

type Handlers = {
    handleMouseOver: () => void;
    handleMouseOut: () => void;
}

const render: React.SFC<Props & Handlers> = ({index, handleMouseOver, handleMouseOut}) => (
    <React.Fragment>
        <a href="#" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            solution {index + 1}
        </a>
        <br/>
    </React.Fragment>
);

export default
withHandlers<Props, Handlers>({
    handleMouseOver: ({onSelect, solution}) => () => onSelect(solution),
    handleMouseOut: ({onSelect}) => () => onSelect(null),
})(render);
