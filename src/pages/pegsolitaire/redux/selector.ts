import * as R from "ramda";
import {createSelector} from "@/commonreact";
import {RootState} from "@/store";
import {Position} from "../types";

const invalidHole =  {row: -1, col: - 1};

const reachableHoles = ({row, col}: Position, pegs: Position[], holes: Position[]) => {
    const ppegs = R.project(["row", "col"], pegs);
    return R.without([invalidHole],
        R.map(
            ([dRow, dCol]) => {
                const peg1 = {row: row + dRow, col: col + dCol};
                const peg2 = {row: row + 2 * dRow, col: col + 2 * dCol};
                return R.contains(peg1, ppegs) && R.contains(peg2, holes) && !R.contains(peg2, ppegs)
                       ? peg2 : invalidHole;
            }, [[0, -1], [0, 1], [1, 0], [-1, 0]]
        )
    );
}

export default
createSelector(
    (state: RootState) => state.pegsolitaire,
    ({pegs, holes, history, rows, columns}) => ({
        pegs: pegs.map(peg => ({...peg, reachableHoles: reachableHoles(peg, pegs, holes) })),
        holes,
        emptyHistory: history === null,
        rows,
        columns,
    })
);


