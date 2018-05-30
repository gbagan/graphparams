import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import './redux.d.ts';
import './promise-worker.d.ts';

import './index.css';
//import 'antd/dist/antd.css';
import './antd.css';
import { HashRouter, Route } from 'react-router-dom';

import ChiffresApp from './chiffres/App';
import { App as SudokuApp } from './sudoku';
import { App as EdsApp } from './eds';
import { App as GraphParamsApp } from './graphparams';
import { App as LightsoutApp } from './lightsout';
import AppMenu from './menu';
import {store} from './store';

const menu = [
    {
        title: "Graphs", submenu: [
            { title: "Parameters", link: "/graph/params", component: GraphParamsApp as any },
            { title: "Eternal Domination", link: "/graph/eds", component: EdsApp as any },
        ]
    },
    {
        title: "Solvers", submenu: [
            { title: "Peg Solitaire", link: "/solvers/pegsolitaire/", component: SudokuApp as any },
            { title: 'Nonogram', link: "/solvers/nonogram", component: SudokuApp as any },
            { title: 'Light Outs', link: "/solvers/lightsout", component: LightsoutApp as any },
            { title: "Le compte est bon", link: "/solvers/chiffres", component: ChiffresApp as any },
            { title: "Sudoku", link: "/solvers/sudoku", component: SudokuApp as any },
        ]
    }
];

export type Menudata = typeof menu;

const routes = (menu: Menudata) =>
    menu.map(item => item.submenu.map(item2 => <Route key={item2.link} path={item2.link} component={item2.component}/>))

const body = (
    <Provider store={store}>
        <HashRouter>
            <div>
                <AppMenu menu={menu} />
                <Route exact path="/" component={SudokuApp} />
                {routes(menu)}
            </div>
        </HashRouter>
    </Provider>
)

window.onload = () => {
    const el = document.getElementById('root');
    ReactDOM.render(body, el);
}