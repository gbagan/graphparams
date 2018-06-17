import { applyMiddleware, combineReducers, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { all } from "redux-saga/effects";
import { StateType } from "typesafe-actions";

/* tslint:disable:no-implicit-dependencies */
import { composeWithDevTools } from "redux-devtools-extension";
/* tslint:enable:no-implicit-dependencies */

import { reducer as eds } from "./pages/eds";
import { reducer as graphparams, saga as graphparamSaga } from "./pages/graphparams";
import { reducer as lightsout } from "./pages/lightsout";
import { reducer as queens } from "./pages/queens";
import { reducer as sudoku } from "./pages/sudoku";

function* rootSaga() {
    yield all([graphparamSaga()]);
}

const reducer = combineReducers({ graphparams, eds, sudoku, lightsout, queens });
const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = composeWithDevTools({});

export const store = createStore(reducer,
    composeEnhancers(
        applyMiddleware(sagaMiddleware),
    ),
);
sagaMiddleware.run(rootSaga);

export type RootState = StateType<typeof reducer>;
