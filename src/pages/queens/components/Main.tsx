import {compose, connect, cxbind, createSelector, /* cxbind, */ React, withStateHandlers} from "@/commonreact";
import {lifecycle} from "recompose";
import {Background, Button, Card, Col} from "@/ui";
import {selector} from "../redux";
import {PieceType} from "../types";

import Form from "./Form";
import Grid from "./Grid";
import Store from "./Store";
import BestScoreDialog from "./BestScoreDialog";

const style = require("../css/style.scss");
export const cx = cxbind(style);

const mapStateToProps = createSelector(selector,
    ({availablePieces, bestScore}) => ({availablePieces, bestScore})
);

const mapDispatchToProps = {};

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

type State = {
    selectedPiece: PieceType;
    bestScoreDialog: boolean;
    help: boolean;
};

type StateHandlers = {
    selectPiece: (p: PieceType) => Partial<State>,
    showBestScoreDialog: () => Partial<State>,
    hideBestScoreDialog: () => Partial<State>,
    flipHelp: () => Partial<State>,
};

const render: React.SFC<Props & State & StateHandlers> = ({selectedPiece, availablePieces,
                help, flipHelp,
                bestScore, bestScoreDialog, showBestScoreDialog, hideBestScoreDialog,
                selectPiece}) => (
    <Background>
        <h1>Queens</h1>
        <div className={cx("container")}>
            <div/>
            <Col>
                <Store availablePieces={availablePieces} selectedPiece={selectedPiece} onSelect={selectPiece} />
                <Grid selectedPiece={selectedPiece} help={help} />
            </Col>
            <Col>
                <Form/>

                <Card className={cx("bestscore")} title="Aide">
                    <Button onClick={flipHelp} color="primary" large>Aide</Button>
                    <Button color="primary" large>Règles</Button>
                </Card>

                <Card className={cx("bestscore")} title="Meilleur score">
                    <div className={cx("body")}>
                        <div>Meilleur score: {bestScore ? bestScore.pieces.length : 0}</div>
                        <div>
                            <Button onClick={showBestScoreDialog} color="primary" large>Voir</Button>
                        </div>
                    </div>
                </Card>
            </Col>
        </div>
        {  bestScoreDialog &&
                <BestScoreDialog {...bestScore.params} pieces={bestScore.pieces} onOk={hideBestScoreDialog}/>
        }
    </Background>
);

export default
compose<State & StateHandlers & Props, {}>(
    connect(mapStateToProps, mapDispatchToProps),
    withStateHandlers<State, StateHandlers, Props>(
        ({availablePieces}) => ({
            selectedPiece: availablePieces[0],
            bestScoreDialog: false,
            help: false,
        }), {
            selectPiece: () => p => ({ selectedPiece: p }),
            showBestScoreDialog: () => () => ({bestScoreDialog: true}),
            hideBestScoreDialog: () => () =>  ({bestScoreDialog: false}),
            flipHelp: ({help}) => () =>  ({help: !help}),
        }
    ),
    lifecycle<Props & StateHandlers, {}, {}>({
        componentWillReceiveProps({selectPiece, availablePieces}) {
            if (this.props.availablePieces !== availablePieces)
                selectPiece(availablePieces[0]);
        }
    }),
)(render);
