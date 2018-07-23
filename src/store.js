import {applyMiddleware, combineReducers, createStore, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {all} from 'redux-saga/effects';

import {reducer as eds} from './pages/eds';
import {reducer as graphparams, saga as graphparamsSaga } from "./pages/graphparams";
//import { reducer as lightsout } from "./pages/lightsout";
import {reducer as sudoku} from './pages/sudoku';

function* rootSaga() {
    yield all([graphparamsSaga()]);
}

const reducer = combineReducers({eds, sudoku, graphparams});
const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, composeEnhancers(
    applyMiddleware(sagaMiddleware),
));

sagaMiddleware.run(rootSaga);

export default store;