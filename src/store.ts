import {combineReducers, createStore} from "redux";
//import createSagaMiddleware from "redux-saga";
//import {all} from "redux-saga/effects";
import {StateType} from "typesafe-actions";

import {reducer as eds} from './pages/eds';
//import { reducer as graphparams, saga as graphparamSaga } from "./pages/graphparams";
//import { reducer as lightsout } from "./pages/lightsout";
import {reducer as sudoku} from "./pages/sudoku";

//function* rootSaga() {
//    yield all([graphparamSaga()]);
//}

const reducer = combineReducers({eds, sudoku}); //   graphparams, eds, sudoku, lightsout });

//const sagaMiddleware = createSagaMiddleware();
// const composeEnhancers = composeWithDevTools({});

export const store = createStore(reducer);
//        applyMiddleware(sagaMiddleware),
//    ),
// sagaMiddleware.run(rootSaga);

export type RootState = StateType<typeof reducer>;
