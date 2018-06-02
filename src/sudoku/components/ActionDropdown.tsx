import * as React from "react";

import Button from "antd/lib/button";
import Dropdown from "antd/lib/dropdown";
import Menu from "antd/lib/menu";

type NameAndData<T> = {
    readonly name: string;
    readonly data: T;
};

type Props = {
    readonly label: string,
    readonly action: (x: any) => void;
    data: ReadonlyArray<NameAndData<any>>;
};

class ActionDropdown extends React.Component<Props> {
    public handleAction = (e: any) => this.props.action(this.props.data[e.key].data);

    public render() {
        const { label, data } = this.props;

        const menu = (
            <Menu onClick={this.handleAction}>
                {data.map((el, i) => <Menu.Item key={i}>{el.name}</Menu.Item>)}
            </Menu>
        );

        return (
            <Dropdown overlay={menu}>
                <Button>{label}</Button>
            </Dropdown>
        );
    }
}

export default ActionDropdown;
