import { StateType } from 'typesafe-actions';
import { combineReducers, createStore } from 'redux'
import { reducer as sudoku } from './sudoku';
import { reducer as eds } from './eds';
//import { devToolsEnhancer } from 'redux-devtools-extension';

const reducer = combineReducers({sudoku, eds});
export const store = createStore(reducer
//    ,devToolsEnhancer({})
);
export type RootState = StateType<typeof reducer>;