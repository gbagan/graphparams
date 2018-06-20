import { cxbind, React, withStateHandlers} from "@/commonreact";
import * as R from "ramda";
import { Button, Card, Col, Row } from "@/ui";
import {LegalMoves} from "../types";
import {flip} from "../util";
import Square from "./Square";
import Checkbox from "./Checkbox";
const style = require("../css/style.scss");
const cx = cxbind(style);

const Nil = () => {return};

type Props = {
    legalMoves: LegalMoves;
    onOk: (moves: LegalMoves) => void;
};

type State = {
    moves: LegalMoves;
};

type StateHandlers = {
    flipLocal: (row: number, col: number) => Partial<State>
    flipDirection: (i: number) => Partial<State>
}

const directions = [
                    {row: -1, col: 0},
                    {row: -1, col: 1},
                    {row: 0, col: 1},
                    {row: 1, col: 1},
                    {row: 1, col: 0},
                    {row: 1, col: -1},
                    {row: 0, col: -1},
                    {row: -1, col: -1}
                ];

const hasDirection = (i: number, m: LegalMoves) => R.contains(directions[i], m.long);

const render: React.SFC<Props & State & StateHandlers> = ({moves, legalMoves, flipLocal, flipDirection, onOk}) => {
    const className = cx("grid", "rows-5", "cols-5");
    return (
        <div className={cx("dialogcontainer")}>
            <div className={cx("dialog", "custom-piece-dialog")}>
                <Card title="Meilleur score">
                    <Row>
                        <Col>
                            <div className={className}>
                                {
                                    R.times(key => {
                                        const row = Math.floor(key / 5) - 2;
                                        const col = key % 5 - 2;
                                        const selected = R.contains({row, col}, moves.local);
                                        const pieceType = row === 0 && col === 0 ? "custom" : null;
                                        return <Square onClick={flipLocal}
                                            {...{ key, row, col, pieceType}}
                                            capturable={false} selected={selected}
                                            onHover={Nil}
                                        />;
                                    }, 25)
                                }
                            </div>
                        </Col>
                        <Col>
                            <Row className={cx("directions")}>
                            {
                                R.map(i =>
                                    <Checkbox key={i} selected={hasDirection(i, moves)} piece="arrow" rotation={(i + 2) % 8}
                                              onSelect={() => flipDirection(i)} />,
                                    R.range(0, 8)
                                )
                            }
                            </Row>
                        </Col>
                    </Row>
                    <Button color="primary" onClick={() => onOk(moves)}>Ok</Button>
                </Card>
            </div>
        </div>
    )
}

export default
withStateHandlers<State, StateHandlers, Props>(({legalMoves}) => ({
    moves: legalMoves,
}), {   
    flipLocal: ({moves}) => (row: number, col: number) => {
        if (row !== 0 || col !== 0)
            return  {
                moves: {...moves, local: flip({row, col}, moves.local)}
            }
    },
    flipDirection: ({moves}) => (i: number) => ({
        moves: {...moves, long: flip(directions[i], moves.long)}
    })
})
(render);
