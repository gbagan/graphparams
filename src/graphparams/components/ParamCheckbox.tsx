import * as React from "react";

// import Checkbox from "antd/lib/checkbox";
import Checkbox from "../../styled/Checkbox";

import {GraphParameter} from "../types";

type Props = {
    data: GraphParameter;
    onToggle: (name: string) => void;
};

const Main: React.SFC<Props> = props => {
    const {name, fullname, checked} = props.data;
    const {onToggle} = props;
    const handleChange = () => onToggle(name);

    return (
       <Checkbox checked={checked} onChange={handleChange}>{fullname}</Checkbox>
    );
};

export default Main;
