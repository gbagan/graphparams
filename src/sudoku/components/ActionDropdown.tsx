import * as React from 'react';
import Menu from 'antd/lib/menu';
import Dropdown from 'antd/lib/dropdown';
import Button from 'antd/lib/button';

interface NameAndData<T> {
    readonly name: string;
    readonly data: T;
}

interface Props {
    readonly label: string,
    readonly action?: (x: any) => void;
    data: ReadonlyArray<NameAndData<any>>;
}

const ActionDropdown: React.SFC<Props> = (props: Props) => {
    const { label, action, data } = props;

    const menu = (
        <Menu onClick={e => action && action(data[parseInt(e.key)].data)}>{
            data.map((el, i) => <Menu.Item key={i}>{el.name}</Menu.Item>)
        }</Menu>
    );

    return (
        <Dropdown overlay={menu}>
            <Button>{label}</Button>
        </Dropdown>
    );
}


export default  ActionDropdown;