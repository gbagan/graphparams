import {createSelector} from "@/commonreact";
import {RootState} from "@/store";

import {Position} from "../types";

const queensWithErrors = (queens: Position[]) =>
    queens.map((q, i) => ({
        ...q,
        error: q.row !== -1 && queens.some((q2, j) =>
            i !== j && q2.row !== -1 &&
                      (q.row === q2.row
                    || q.col === q2.col
                    || Math.abs(q.row - q2.row) === Math.abs(q.col - q2.col)
                   )
        ),
    }));

export default
createSelector(
    (state: RootState) => state.queens,
    ({queens}) => {
        const queens2 = queensWithErrors(queens);
        return {
            isFinished: queens.length > 0 && queens2.every(({row, error}) => row !== -1 && !error),
            queens: queens2,
            size: queens.length,
        }
    }
);
