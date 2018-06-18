import {createSelector} from "@/commonreact";
import {RootState} from "@/store";

import {areNeighbors} from "../util";

import {Position} from "../types";

const queensWithConflict = (queens: Position[]) =>
    queens.map((q1, i) => ({
        ...q1,
        inConflict: q1.row !== -1 && queens.some((q2, j) => i !== j && areNeighbors(q1, q2)),
    }));

export default
createSelector(
    (state: RootState) => state.queens,
    ({queens}) => {
        const queens2 = queensWithConflict(queens);
        return {
            isFinished: queens.length > 0 && queens2.every(({row, inConflict}) => row !== -1 && !inConflict),
            queens: queens2,
            size: queens.length,
        }
    }
);
