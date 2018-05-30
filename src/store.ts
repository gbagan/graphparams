import { combineReducers, createStore, applyMiddleware } from 'redux'
import { StateType } from 'typesafe-actions';
import { all } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';

import { reducer as graphparams, saga as graphparamSaga } from './graphparams';
import { reducer as sudoku } from './sudoku';
import { reducer as eds } from './eds';
import { reducer as lightsout } from './lightsout';
import { composeWithDevTools } from 'redux-devtools-extension';

function* rootSaga() {
    yield all([graphparamSaga()])
}

const reducer = combineReducers({ graphparams, eds, sudoku, lightsout });
const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = composeWithDevTools({});

export const store = createStore(reducer,
    composeEnhancers(
    applyMiddleware(sagaMiddleware)
    )
);
sagaMiddleware.run(rootSaga);

export type RootState = StateType<typeof reducer>;