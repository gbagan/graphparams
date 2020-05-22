import {connect, createSelector, React} from "@/commonreact";
import {actions, selector} from "../reducers";
import OutputParameter from "./OutputParameter";
import { pick } from "@/lib/fp";

const Output = ({ parameters, error, onShowWitness, className }) => (
    <div className={className} title="Output">
    {
        error 
        ? <span>{error}</span>
        : parameters.filter(p => p.result !== null).map(param =>
            <OutputParameter key={param.name} parameter={param} onShowWitness={onShowWitness} />
        )
    }
    </div>
)

export default
connect(
    createSelector(selector, pick('error,parameters')), {
        onShowWitness: actions.showWitness
    }
)(Output);
