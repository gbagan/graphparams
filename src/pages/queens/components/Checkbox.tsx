import {  cxbind, React } from "@/commonreact";
const style = require("../css/style.scss");
const cx = cxbind(style);

type Props = {
    selected: boolean;
    onSelect: () => void;
    text?: string;
    piece?: string;
    rotation?: number;
};

const render: React.SFC<Props> =  ({selected, piece, text, rotation, onSelect}) => (
    <div onClick={onSelect} className={cx("checkbox", {selected})}>
    {
        piece ? <div className={cx("piece", piece, "rotation-" + (rotation || 0))}/> : <span>{text}</span>
    }
    </div>
);

export default render;