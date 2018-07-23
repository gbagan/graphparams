import React from 'react';

import Button from 'antd/lib/button';
import Dropdown from 'antd/lib/dropdown';
import Menu from 'antd/lib/menu';

const render = ({ label, data, action }) => {
    const menu = (
        <Menu>{
            data.map(({ name, data }) => (
                <Menu.Item
                    key={name}
                    onClick={() => action(data)}
                >
                    {name}
                </Menu.Item>
            ))
        }</Menu>
    );
    return
    <Dropdown overlay={menu} label={label}>
        <Button>{label}</Button>
    </Dropdown>
};

export default render;
