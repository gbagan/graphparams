import * as React from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import {Text} from "@/ui";

import * as actions from "../redux/actions";
import selector from "../redux/selector";
import OutputParameter from "./OutputParameter";

const mapStateToProps = createSelector(selector,
    ({error, parameters}) => ({error, parameters})
);

const mapDispatchToProps = {
    onShowWitness: actions.showWitness,
};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & { className?: string };

const render: React.SFC<Props> = ({ parameters, error, onShowWitness, className }) => (
    <div className={className} title="Output">
    {
        error 
        ? <Text color="error">{error}</Text>
        : parameters.filter(p => p.result !== null).map(param =>
            <OutputParameter key={param.name} parameter={param} onShowWitness={onShowWitness} />
        )
    }
    </div>
)

export default
connect(mapStateToProps, mapDispatchToProps)(render);
