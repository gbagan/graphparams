import { getType, ActionType, } from 'typesafe-actions';
import * as actions from './actions';
import {Solution} from '../types';
import solve from "../libs/solver";

export type Action = ActionType<typeof actions>;

type State = {
    rows: number;
    columns: number;
    nbColors: number;
    toroidal: boolean;
    board: ReadonlyArray<number> | null;
    solutions: ReadonlyArray<Solution> | null;
    currentSolution: Solution | null;
}

const initialState = {
    rows: 0,
    columns: 0,
    nbColors: 0,
    toroidal: false,
    board: null,
    solutions: null,
    currentSolution: null
}

export default function reducer(state: State = initialState, action: Action): State {
    switch(action.type) {
        case getType(actions.generate): {
            const { rows, columns, nbColors, toroidal} = action.payload;
            const board = new Array<number>(rows*columns);
            board.fill(0); 
            return { ...state, rows, columns, nbColors, toroidal, board, solutions: null, currentSolution: null };
        }
        case getType(actions.switchCell): {
            if (!state.board)
                return state;
            const i = action.payload.row * state.columns + action.payload.column;
            const board = state.board.map((val, j) => i === j ? (val + 1) % state.nbColors : val) 
            return { ...state, board, solutions: null, currentSolution: null };
        }
        case getType(actions.solve): {
            if (!state.board)
                return state;
            const solutions = [...solve(state.board, state.rows, state.columns, state.nbColors, state.toroidal, 250)];
            const sol = solutions.length === 0 ? {} : {currentSolution: solutions[0]};
            return {...state, solutions,...sol};
        }
        case getType(actions.reverse): {
            if (!state.board)
                return state;
            const board = state.board.map(val => (val + 1) % state.nbColors) 
            return { ...state, board, solutions: null, currentSolution: null };
        }
        case getType(actions.showSolution): {
            return { ...state, currentSolution: action.payload };
        }
        default:
            return state;
    }
}