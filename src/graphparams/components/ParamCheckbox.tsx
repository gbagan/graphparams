import * as React from "react";
import {withHandlers} from "recompose";
import {Checkbox} from "@/ui";

import { GraphParameter } from "../types";

type Props = {
    data: GraphParameter;
    onToggle: (name: string) => void;
};

type HandlerProps = {
    handleToggle: () => void;
}

const render: React.SFC<Props & HandlerProps> = ({ onToggle, data, handleToggle }) => {
    const { checked, fullname } = data;
    return (
        <React.Fragment>
            <Checkbox checked={checked} onChange={handleToggle}>
                {fullname}
            </Checkbox>
            <br />
        </React.Fragment>
    );
};

export default
withHandlers<Props, HandlerProps>({
    handleToggle: ({data, onToggle}) => () => onToggle(data.name)
})(render);
