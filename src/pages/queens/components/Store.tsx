import { cxbind, React } from "@/commonreact";
import {PieceType} from "../types";
import {Row} from "@/ui";
import Checkbox from "./Checkbox";
const style = require("../css/style.scss");
const cx = cxbind(style);

type Props = {
    availablePieces: PieceType[],
    selectedPiece: PieceType,
    onSelect: (p: PieceType) => void;
};

const render: React.SFC<Props> = ({ availablePieces, selectedPiece, onSelect }) => {
    return (
        <Row className={cx("store")} gutter={16}>
        {
            availablePieces.map((piece, key) => (
                <Checkbox key={key} selected={piece === selectedPiece} piece={piece} onSelect={() => onSelect(piece)} />
            ))
        }
        </Row>
    );
};

export default render;
