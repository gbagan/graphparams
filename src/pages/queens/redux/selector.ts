import {createSelector} from "@/commonreact";
import {RootState} from "@/store";

export default
createSelector(
    (state: RootState) => state.queens,
    ({pieces, rows, columns, rules}) => {
        // const queens2 = queensWithConflict(queens);
        return {
            // isFinished: queens.length > 0 && queens2.every(({row, inConflict}) => row !== -1 && !inConflict),
            pieces,
            rows,
            columns,
            availablePieces: rules.pieces,
        };
    }
);
