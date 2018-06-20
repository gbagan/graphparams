import { cxbind, React, } from "@/commonreact";
import * as R from "ramda";
import { Button, Card } from "@/ui";
import {Piece} from "../types";
import Square from "./Square";
const style = require("../css/style.scss");
const cx = cxbind(style);

const Nil = () => {return};

type Props = {
    rows: number;
    columns: number;
    pieces: Piece[];
    onOk: () => void;
}

const render: React.SFC<Props> = ({rows, columns, pieces, onOk}) => {
    const className = cx("grid", "rows-" + rows, "cols-" + columns);
    return (
        <div className={cx("dialogcontainer")}>
            <div className={cx("dialog",  "bscoredialog")}>
                <Card title="Meilleur score">
                    <div className={className}>
                        {
                            R.times(key => {
                                const row = Math.floor(key / columns);
                                const col = key % columns;
                                const pieceIndex = R.findIndex(R.equals({ row, col }), R.project(["row", "col"], pieces));
                                const pieceType = pieceIndex === -1 ? null : pieces[pieceIndex].type;
                                return <Square // onClick={handleSquareClick}
                                    {...{ key, row, col, pieceType}} capturable={false} selected={false}
                                    onClick={Nil} onHover={Nil}
                                // selectedWarning={betweenConflicts}
                                />;
                            }, rows * columns)
                        }
                    </div>

                    <Button color="primary" onClick={onOk}>Ok</Button>
                </Card>
            </div>
        </div>
    )
}

export default render;