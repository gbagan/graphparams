import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';

import { HashRouter, Route, Link } from 'react-router-dom';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon'

import ChiffresApp from './chiffres/App';
import SudokuApp from './sudoku/App';
import EdsApp from './eds/App'

const menu = [
    { title: "Graphs", submenu:[
        { title: "Parameters",         link: "/graph/params", component: SudokuApp as any},
        { title: "Eternal Domination", link: "/graph/eds", component: EdsApp as any},
    ]},
    { title: "Solvers", submenu:[
        { title: "Peg Solitaire",     link: "/solvers/pegsolitaire/", component: SudokuApp as any},
        { title: 'Nonogram',          link: "/solvers/nonogram",      component: SudokuApp as any},
        { title: 'Light Outs',        link: "/solvers/lightsout",     component: SudokuApp as any},
        { title: "Le compte est bon", link: "/solvers/chiffres",      component: ChiffresApp as any},
        { title: "Sudoku",            link: "/solvers/sudoku",        component: SudokuApp as any},
    ]}
];

type Menudata = typeof menu;

function routes(menu: Menudata) {
    const t = [];
    let i = 0;
    for (const {submenu} of menu) {
        for (const {link, component} of submenu) {
            t.push((<Route key={i} path={link} component={component} />));
            i++;
        }
    }
    return t;
}


//type MenuItems = [string, [string, string, React.Component][]][];

/*
interface Props {
    menu: MenuItems,
    label: string
}
*/

interface Props {
    menu: Menudata;
}

interface State {
    current: string;
}


class Mymenu extends React.Component<Props, State> {
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

const body = (
    <HashRouter>
        <div>
            <Mymenu menu={menu} />
            <Route exact path="/" component={SudokuApp} />
            {routes(menu)}
        </div>
    </HashRouter>
)

ReactDOM.render(
    body,
    document.getElementById('root'));

