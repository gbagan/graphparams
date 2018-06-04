import * as React from "react";
import { Provider } from "react-redux";
import { withRouter } from "react-router";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import { TransitionGroup } from "react-transition-group";
import styled from "styled-components";

import ChiffresApp from "./chiffres/App";
import { App as EdsApp } from "./eds";
import { App as GraphParamsApp } from "./graphparams";
import { App as LightsoutApp } from "./lightsout";
import { App as SudokuApp } from "./sudoku";

import AppMenu from "./menu";
import { store } from "./store";

import Slide from "./transitions/slide";

const mainmenu = [
    {
        submenu: [
            { title: "Parameters", link: "/graph/params", component: GraphParamsApp as any },
            { title: "Eternal Domination", link: "/graph/eds", component: EdsApp as any },
        ],
        title: "Graphs",
    },
    {
        submenu: [
            { component: SudokuApp as any, link: "/solvers/pegsolitaire", title: "Peg Solitaire" },
            { component: SudokuApp as any, link: "/solvers/nonogram", title: "Nonogram" },
            { component: LightsoutApp as any, link: "/solvers/lightsout", title: "Light Outs" },
            { component: ChiffresApp as any, link: "/solvers/chiffres", title: "Le compte est bon" },
            { component: SudokuApp as any, link: "/solvers/sudoku", title: "Sudoku" },
        ],
        title: "Solvers",
    },
];

export type Menudata = typeof mainmenu;

const routes =
    mainmenu.map(item =>
        item.submenu.map(item2 => <Route key={item2.link} path={item2.link} component={item2.component} />));

const MySwitch = (props: any) => (
    <Switch location={props.location}>
        {routes}
        <Redirect from="/" to="/graph/params" />
    </Switch>
);

const Container = styled.div`
    width: 100vw;
    height: 100vh;
`;

/* tslint:disable */
export const AppWithTransition = (props: any) => (
    <Container>
        <AppMenu menu={mainmenu} />
        <TransitionGroup>
            <Slide key={props.location.pathname}>
                <MySwitch location={props.location} />
            </Slide>
        </TransitionGroup>
    </Container>
);

const AppWithRouter = withRouter(AppWithTransition);

/* tslint:enable */

export default () => (
    <Provider store={store}>
        <HashRouter>
            <AppWithRouter />
        </HashRouter>
    </Provider>
);
