import {React} from "@/commonreact";
import { Provider } from "react-redux";
import { withRouter } from "react-router";
import { HashRouter } from "react-router-dom";
import style from './App.scss';

import Layout from 'antd/lib/layout';
// import { TransitionGroup } from "react-transition-group";

import AppMenu from "./menu";
import store from "./store";
import Switch from "./routes";

export const AppWithTransition = props => (
    <Layout className={style.layout}>
        <AppMenu />
        <Switch location={props.location} />
    </Layout>
);

export const AppWithRouter = withRouter(AppWithTransition);

const AppWithStore = () => (
    <Provider store={store}>
        <HashRouter>
            <AppWithRouter />
        </HashRouter>
    </Provider>
);

export default AppWithStore;
