import * as React from "react";
import { Provider } from "react-redux";
import { withRouter } from "react-router";
import { HashRouter } from "react-router-dom";
import { TransitionGroup } from "react-transition-group";
import styled from "styled-components";

import AppMenu from "./menu";
import { store } from "./store";
import Slide from "./transitions/slide";
import Switch from "./routes";

const Container = styled.div`
    width: 100vw;
    height: 100vh;
`;


export const AppWithTransition = (props: any) => (
    <Container>
        <AppMenu />
        <TransitionGroup>
            <Slide key={props.location.pathname}>
                <Switch location={props.location} />
            </Slide>
        </TransitionGroup>
    </Container>
);

const AppWithRouter = withRouter(AppWithTransition);

export default () => (
    <Provider store={store}>
        <HashRouter>
            <AppWithRouter />
        </HashRouter>
    </Provider>
);
