import {React, withHandlers} from "@/commonreact";

const render = ({parameter: {result, fullname}, handleShowWitness, handleHideWitness}) => {
    if (!result) return <span />;
    let resultJsx;
    if (result === 'computing') {
        resultJsx = <span>{fullname} : Computing</span>;
    } else if (result.witness === null) {
        resultJsx = <span>{fullname} : {result.result.toString()}</span>
    } else {
        resultJsx = (
            <a href="#" onMouseOver={handleShowWitness} onMouseOut={handleHideWitness}>
                <span>{fullname} : {result.result.toString()}</span>
            </a>
        )
    }

    return (
        <React.Fragment>
            {resultJsx}
            <br />
        </React.Fragment>
    )
};

export default
withHandlers({
    handleHideWitness: props => () => props.onShowWitness(null),
    handleShowWitness: props => () => props.onShowWitness(props.parameter),
})((render));
