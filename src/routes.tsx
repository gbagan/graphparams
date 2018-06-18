import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import ChiffresApp from "./pages/chiffres/App";
import { App as EdsApp } from "./pages/eds";
import { App as GraphParamsApp } from "./pages/graphparams";
import { App as LightsoutApp } from "./pages/lightsout";
import { App as PegSolitaireApp } from "./pages/pegsolitaire";
import { App as QueensApp } from "./pages/queens";
import { App as SudokuApp } from "./pages/sudoku";

export default (props: any) => (
    <Switch location={props.location}>
        <Route path="/graph/params" component={GraphParamsApp} />
        <Route path="/graph/eds" component={EdsApp} />
        <Route path="/solvers/pegsolitaire" component={SudokuApp}/>
        <Route path="/solvers/lightsout" component={LightsoutApp}/>
        <Route path="/solvers/chiffres" component={ChiffresApp}/>
        <Route path="/solvers/sudoku" component={SudokuApp}/>
        <Route path="/games/pegsolitaire" component={PegSolitaireApp}/>
        <Route path="/games/queens" component={QueensApp}/>
        <Redirect from="/" to="/graph/params" />
    </Switch>
);
