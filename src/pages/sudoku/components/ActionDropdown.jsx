import React from 'react';

import Dropdown, {DropdownItem} from '@/ui/Dropdown';

//  public handleAction = (e: any) => this.props.action(this.props.data[e.key].data);

const render = ({label, data, action}) => (
    <Dropdown label={label}>
    {
        data.map(({name, data}) => (
            <DropdownItem key={name} onClick={() => action(data)}>{name}</DropdownItem>
        ))
    }
    </Dropdown>
);

export default render;
