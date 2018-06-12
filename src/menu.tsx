import * as React from "react";
// import { Link } from "react-router-dom";

import Menu from "./styled/Menu";

import { Menudata } from "./App";

type Props = {
    menu: Menudata;
};

type State = {
    current: string;
};

export default class Mymenu extends React.Component<Props, State> {
    public render() {
        return (
            <Menu.Menu horizontal>
                <Menu.Item><a>Test</a></Menu.Item>
                <Menu.Item><a>Test2</a></Menu.Item>
            </Menu.Menu>
        );
    }
}
