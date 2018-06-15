import * as React from "react";
import { Provider } from "react-redux";
import { withRouter } from "react-router";
import { HashRouter } from "react-router-dom";
import { TransitionGroup } from "react-transition-group";

import AppMenu from "./menu";
import { store } from "./store";
import Slide from "./transitions/slide";
import Switch from "./routes";

export const AppWithTransition = (props: any) => (
    <React.Fragment>
        <AppMenu />
        <TransitionGroup>
            <Slide key={props.location.pathname}>
                <Switch location={props.location} />
            </Slide>
        </TransitionGroup>
    </React.Fragment>
);

const AppWithRouter = withRouter(AppWithTransition);

export default () => (
    <Provider store={store}>
        <HashRouter>
            <AppWithRouter />
        </HashRouter>
    </Provider>
);
