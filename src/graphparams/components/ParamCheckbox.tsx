import * as React from "react";

// import Checkbox from "antd/lib/checkbox";
import Checkbox from "../../styled/Checkbox";

import { GraphParameter } from "../types";

type Props = {
    data: GraphParameter;
    onToggle: (name: string) => void;
};

const PCB: React.SFC<Props> = props => {
    const { onToggle, data } = props;
    const { checked, fullname, name } = data;
    return (
        <React.Fragment>
            <Checkbox checked={checked} onChange={() => onToggle(name)}>{fullname}</Checkbox>
            <br/>
        </React.Fragment>
    );
}

export default PCB;
