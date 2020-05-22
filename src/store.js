import {applyMiddleware, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {all} from 'redux-saga/effects';

import {reducer, initialState, saga } from "./reducers";

function* rootSaga() {
    yield all([saga()]);
}

const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducer, initialState, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);
console.log('init', initialState);
export default store;