import { combineReducers, createStore, applyMiddleware } from 'redux'
import { StateType } from 'typesafe-actions';
import { all } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';

import { reducer as graphparams, saga as graphparamSaga } from './graphparams';
import { reducer as sudoku } from './sudoku';
import { reducer as eds } from './eds';
//import { devToolsEnhancer } from 'redux-devtools-extension';

function* rootSaga() {
    yield all([graphparamSaga])
}

const reducer = combineReducers({ graphparams, eds, sudoku });
const sagaMiddleware = createSagaMiddleware();

export const store = createStore(reducer,
    applyMiddleware(sagaMiddleware)
    //,devToolsEnhancer({})
);
sagaMiddleware.run(rootSaga);

export type RootState = StateType<typeof reducer>;