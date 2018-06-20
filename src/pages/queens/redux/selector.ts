import * as R from "ramda";
import {createSelector} from "@/commonreact";
import {RootState} from "@/store";
import {PieceType, LegalMoves,} from "../types";
import {isCapturable, legalMovesFor, reachableFrom, square} from "../util";

export default
createSelector(
    (state: RootState) => state.queens,
    ({pieces, rows, columns, availablePieces, bestScores, customLegalMoves}) => {
        const params = {columns, rows, availablePieces};
        const index = R.findIndex(R.propEq("params", params), bestScores);
        const bestScore = bestScores[index];
        // const queens2 = queensWithConflict(queens);
        return {
            // isFinished: queens.length > 0 && queens2.every(({row, inConflict}) => row !== -1 && !inConflict),
            pieces: pieces.map(p => ({...p, reachable: reachableFrom(p, rows, columns, customLegalMoves)})),
            rows,
            columns,
            bestScore,
            availablePieces,
            customLegalMoves,
            rulesFor: R.fromPairs(availablePieces.map(p =>
                            [p, legalMovesFor(p, customLegalMoves)] as [PieceType, LegalMoves])),
            capturableSquares: R.filter(p => isCapturable(p, pieces, customLegalMoves), square(rows, columns)),
        };
    }
);
