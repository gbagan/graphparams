import * as React from "react";
import { Link } from "react-router-dom";

import Icon from "antd/lib/icon";
import Menu from "antd/lib/menu";

import {Menudata} from "./App";

type Props = {
    menu: Menudata;
};

type State = {
    current: string;
};

export default class Mymenu extends React.Component<Props, State> {
    public state = { current: "mail" };
    public handleClick = (e: any) => this.setState({ current: e.key });

    public render() {
        const submenu = (list: any[]) =>
        list.map((item2, i) => (
            <Menu.Item key={item2.link}><Link to={item2.link}>{item2.title}</Link></Menu.Item>
        ));

        const menu = this.props.menu.map((item, i) => (
            <Menu.ItemGroup key={item.title} title={item.title}>{submenu(item.submenu)}</Menu.ItemGroup>
        ));

        return (
            <Menu
                onClick={this.handleClick}
                selectedKeys={[this.state.current]}
                mode="horizontal"
            >
                <Menu.SubMenu title={<span><Icon type="setting" />Apps</span>}>{menu}</Menu.SubMenu>
            </Menu>
        );
    }
}
