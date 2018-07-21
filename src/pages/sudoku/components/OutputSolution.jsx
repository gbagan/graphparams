import {React, withHandlers} from "@/commonreact";

const render = ({index, handleMouseOver, handleMouseOut}) => (
    <React.Fragment>
        <a href="#" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            solution {index + 1}
        </a>
        <br/>
    </React.Fragment>
);

export default
withHandlers({
    handleMouseOver: props => () => props.onSelect(props.solution),
    handleMouseOut: props => () => props.onSelect(null),
})(render);
