import {  cxbind, React } from "@/commonreact";
import {PieceType} from "../types";
const style = require("../css/style.scss");
const cx = cxbind(style);

type Props = {
    selected: boolean;
    onSelect: () => void;
    text?: string;
    piece?: PieceType;
};

const render: React.SFC<Props> =  ({selected, piece, text, onSelect}) => (
    <div onClick={onSelect} className={cx("checkbox", {selected})}>
    {
        piece ? <div className={cx("piece", piece)}/> : <span>{text}</span>
    }
    </div>
);

export default render;