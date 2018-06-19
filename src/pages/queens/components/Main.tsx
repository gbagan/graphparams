import {compose, connect, cxbind, createSelector, /* cxbind, */ React, withStateHandlers} from "@/commonreact";
import { Background, Col} from "@/ui";
import {selector} from "../redux";
import {PieceType} from "../types";

import Form from "./Form";
import Grid from "./Grid";
import Store from "./Store";

const style = require("../css/style.scss");
export const cx = cxbind(style);

const mapStateToProps = createSelector(selector,
    ({availablePieces}) => ({availablePieces})
);

    // ({isFinished}) => ({isFinished}),
// );

const mapDispatchToProps = {};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

type State = {
    selectedPiece: PieceType;
};

type StateHandlers = {
    selectPiece: (p: PieceType) => Partial<State>,
}

const render: React.SFC<Props & State & StateHandlers> = ({selectedPiece, availablePieces, selectPiece}) => (
    <Background>
        <h1>Queens</h1>
        <div className={style.container}>
            <Col>
               <Grid selectedPiece={selectedPiece} />
               <Store availablePieces={availablePieces} selectedPiece={selectedPiece} onSelect={selectPiece} />
            </Col>
                <Form/>
        </div>

    </Background>
);

export default
compose<State & StateHandlers & Props, {}>(
    connect(mapStateToProps, mapDispatchToProps),
    withStateHandlers<State, StateHandlers, Props>(
        ({availablePieces}) => ({
            selectedPiece: availablePieces[0],
        }), {
            selectPiece: () => p => ({ selectedPiece: p })
        }
    ),
)(render);
