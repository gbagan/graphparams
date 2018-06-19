import * as R from "ramda";
import { compose, connect, React, withHandlers, cxbind, withStateHandlers } from "@/commonreact";
import {actions} from "../redux";
import {PieceType} from "../types";
import {Button, Card, Col, Row} from "@/ui";
import Checkbox from "./Checkbox";
import {Rules} from "../types";
const style = require("../css/style.scss");
const cx = cxbind(style);


const mapStateToProps = () => ({});

const mapDispatchToProps = {
    onSubmit: actions.newGrid,
};


type Props = {
    onSubmit: (d: {rows: number; columns: number, rules: Rules}) => void;
}

type State = {
    sizeName: "g44" | "g55" | "g77" | "g88" | "custom";
    queen: boolean;
    king: boolean;
    bishop: boolean;
    knight: boolean;
};

type StateHandlers = {
    setState: (s: Partial<State>) => Partial<State>
};

type Handlers = {
    set: (s: Partial<State>) => () => Partial<State>
    handleStart: () => void;
};

const render: React.SFC<State & Handlers> = ({sizeName, queen, king, bishop, knight, set, handleStart}) => (
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
            </Row>
            <Row>
                <Button large color="primary" onClick={handleStart}>Commencer</Button>
            </Row>
        </Col>
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
    withStateHandlers<State, StateHandlers, {}>({
        sizeName: "g88",
        queen: true,
        king: false,
        bishop: false,
        knight: false,
    }, {
        setState: () => s => s,
    }),
    withHandlers<Props & State & StateHandlers, Handlers>({
        set: ({setState}) => s => () => setState(s),
        handleStart: ({sizeName, queen, king, bishop, knight, onSubmit}) => () => {
            const rowsColumns =  sizeNameToObject(sizeName);
            const pieces = R.keys(R.pickBy(val => !!val, {queen, king, bishop, knight})) as PieceType[];
            const data = {...rowsColumns, rules: {pieces}};
            onSubmit(data);
        }
    })
)(render);
