import * as React from "react";

const style = require("./Card.scss");

type Props = {
    className?: string;
    title: string;
};

const Card: React.SFC<Props> = props => (
    <div className={style.card}>
        <div className={style.head}>
            <div className={style.flex}>
                <div className={style.title}>{props.title}</div>
            </div>
        </div>
        <div className={style.body}>{props.children}</div>
    </div>
);

export default Card;
