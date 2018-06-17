import * as React from "react";

import Dropdown, {DropdownItem} from "@/ui/Dropdown";

type NameAndData<T> = {
    readonly name: string;
    readonly data: T;
};

type Props = {
    label: string,
    action: (x: any) => void;
    data: Array<NameAndData<any>>;
};

//  public handleAction = (e: any) => this.props.action(this.props.data[e.key].data);

const render: React.SFC<Props> = ({label, data, action}) => (
    <Dropdown label={label}>
    {
        data.map(({name, data}) => (
            <DropdownItem key={name} onClick={() => action(data)}>{name}</DropdownItem>
        ))
    }
    </Dropdown>
);

export default render;
