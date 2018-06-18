import { ActionType } from "typesafe-actions";
import actions from "./actions";
import {Position} from "../types";
import {englishBoard} from "../boards";

export type Action = ActionType<typeof actions>;

export type State = {
    pegs: (Position & {id: number})[];
    holes: Position[];
    rows: number;
    columns: number;
};

const initialState: State = {
    ...englishBoard,
};

export default function reducer(state: State = initialState, action: Action): State {
    switch (action.type) {
        default:
            return state;
    }
}
