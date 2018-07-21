import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";

import ChiffresApp from './pages/chiffres/App';
import {App as SudokuApp} from './pages/sudoku';
import {App as EdsApp} from "./pages/eds";

/*
import { App as GraphParamsApp } from "./pages/graphparams";
import { App as LightsoutApp } from "./pages/lightsout";
*/

const AppsSwitch = props => (
    <Switch location={props.location}>
        <Route path='/graph/eds' component={EdsApp} />
        <Route path='/solvers/chiffres' component={ChiffresApp} />
        <Route path='/solvers/sudoku' component={SudokuApp} />
        <Redirect from='/' to='/graph/params' />
    </Switch>
);

export default AppsSwitch;

/*
<Route path="/graph/params" component={GraphParamsApp} />

<Route path="/solvers/pegsolitaire" component={SudokuApp}/>
<Route path="/solvers/lightsout" component={LightsoutApp}/>


*/