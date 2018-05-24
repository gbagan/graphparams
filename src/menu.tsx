import * as React from 'react';
import { Link } from 'react-router-dom';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon'
import {Menudata} from './'

interface Props {
    menu: Menudata;
}

interface State {
    current: string;
}

export default class Mymenu extends React.Component<Props, State> {
    state = {
        current: 'mail',
    }
    handleClick = (e: any) => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }
    render() {
        return (
            <Menu
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}
                mode="horizontal"
            >
                <Menu.SubMenu title={<span><Icon type="setting" />Apps</span>}>{
                    this.props.menu.map((item, i) => (
                        <Menu.ItemGroup key={i} title={item.title}>{
                            item.submenu.map((item2, j) => (
                                <Menu.Item key={j}><Link to={item2.link}>{item2.title}</Link></Menu.Item>
                            ))
                        }</Menu.ItemGroup>
                    ))
                }</Menu.SubMenu>
            </Menu>
        );
    }
}