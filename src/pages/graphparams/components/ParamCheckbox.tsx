import { React, withHandlers } from "@/commonreact";
import {Checkbox} from "@/ui";

import { GraphParameter } from "../types";

type Props = {
    data: GraphParameter;
    onToggle: (name: string) => void;
};

type Handlers = {
    handleToggle: () => void;
}

const render: React.SFC<Props & Handlers> = ({ onToggle, data, handleToggle }) => {
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
withHandlers<Props, Handlers>({
    handleToggle: ({data, onToggle}) => () => onToggle(data.name)
})(render);
