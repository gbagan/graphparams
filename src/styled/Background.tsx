import * as React from "react";
const style = require("./Background.scss");

const Background: React.SFC<{}> = props => (
    <div className={style.bg}>
        <div className={style.fullscreen}>
            <div>
                {props.children}
            </div>
        </div>
    </div>
);

export default Background;
