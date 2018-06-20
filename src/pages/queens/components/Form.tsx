import * as R from "ramda";
import { compose, connect, React, withHandlers, cxbind, withStateHandlers } from "@/commonreact";
import {actions} from "../redux";
import {PieceType, LegalMoves} from "../types";
import {Button, Card, Col, Row} from "@/ui";
import Checkbox from "./Checkbox";
import {piecesList} from "../util";
import CustomPieceDialog from "./CustomPieceDialog";
const style = require("../css/style.scss");
const cx = cxbind(style);


const mapStateToProps = () => ({});

const mapDispatchToProps = {
    onSubmit: actions.newGrid,
};

// initPieces = 


type Props = {
    onSubmit: (d: {rows: number; columns: number, availablePieces: PieceType[], customLegalMoves: LegalMoves}) => void;
}

type State = {
    sizeName: "g44" | "g55" | "g77" | "g88" | "custom";
    queen: boolean;
    king: boolean;
    bishop: boolean;
    knight: boolean;
    custom: boolean;
    customPieceDialog: boolean;
    legalMoves: LegalMoves;
};

type StateHandlers = {
    setState: (s: Partial<State>) => Partial<State>;
};

type Handlers = {
    set: (s: Partial<State>) => () => void;
    handleStart: () => void;
    showCustomPieceDialog: () => void;
    hideCustomPieceDialog: (moves: LegalMoves) => void;
};

const render: React.SFC<State & Handlers> = ({sizeName, queen, king, bishop, knight, custom,
                                              set, handleStart, legalMoves,
                                              customPieceDialog, showCustomPieceDialog, hideCustomPieceDialog}) => (
    <Card title="Paramètres">
        <Col className={cx("form")}>
            <Row>
                <h1>Taille</h1>
            </Row>
            <Row gutter={16}>
                <Checkbox selected={sizeName === "g44"} onSelect={set({sizeName: "g44"})} text={"4x4"} />
                <Checkbox selected={sizeName === "g55"} onSelect={set({sizeName: "g55"})} text={"5x5"} />
                <Checkbox selected={sizeName === "g77"} onSelect={set({sizeName: "g77"})} text={"7x7"} />
                <Checkbox selected={sizeName === "g88"} onSelect={set({sizeName: "g88"})} text={"8x8"} />
            </Row>
            <Row>
                <h1>Pièces</h1>
            </Row>
            <Row gutter={16}>
                <Checkbox selected={queen} onSelect={set({queen: !queen})} piece="queen" />
                <Checkbox selected={king} onSelect={set({king: !king})} piece="king" />
                <Checkbox selected={bishop} onSelect={set({bishop: !bishop})} piece="bishop" />
                <Checkbox selected={knight} onSelect={set({knight: !knight})} piece="knight" />
                <Checkbox selected={custom} onSelect={set({custom: !custom})} piece="custom" />
            </Row>

            <Row className={cx("begindiv")}>
                <Button large onClick={showCustomPieceDialog}>Perso</Button>
            </Row>

            <Row className={cx("begindiv")}>
                <Button large color="primary" onClick={handleStart}>Commencer</Button>
            </Row>
        </Col>

        {  customPieceDialog &&
                <CustomPieceDialog legalMoves={legalMoves} onOk={hideCustomPieceDialog}/>
        }

    </Card>
);

function sizeNameToObject(name: string) {
    if (name === "g44")
        return {rows: 4, columns: 4};
    else if (name === "g55")
        return {rows: 5, columns: 5};
    else if (name === "g77")
        return {rows: 7, columns: 7};
    else if (name === "g88")
        return {rows: 8, columns: 8};
    else
        return {rows: 8, columns: 8};
}

export default
compose<State & Handlers, {}>(
    connect(mapStateToProps, mapDispatchToProps),
    withStateHandlers<State, StateHandlers, Props>({
        sizeName: "g88",
        queen: true,
        king: false,
        bishop: false,
        knight: false,
        custom: false,
        customPieceDialog: false,
        legalMoves: ({long: [], local: []}),
    }, {
        setState: () => s => s,
    }),
    withHandlers<Props & State & StateHandlers, Handlers>({
        set: ({setState}) => s => () => setState(s),
        handleStart: ({sizeName, queen, king, bishop, knight, custom, legalMoves, onSubmit}) => () => {
            const rowsColumns =  sizeNameToObject(sizeName);
            const availablePieces = R.keys(R.pickBy(val => !!val, {queen, king, bishop, knight, custom})) as PieceType[];
            const data = {...rowsColumns, availablePieces, customLegalMoves: legalMoves};
            onSubmit(data);
        },
        showCustomPieceDialog: ({setState}) => () => setState({customPieceDialog: true}),
        hideCustomPieceDialog: ({setState}) => (moves: LegalMoves) => setState({legalMoves: moves, customPieceDialog: false}),
    })
)(render);
