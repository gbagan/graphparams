import * as cx from "classnames";
import * as React from "react";

const style = require("./Radio.scss");

type ButtonProps = {
    value: string;
    text: string;
    checked: boolean;
    disabled: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const RadioButton: React.SFC<ButtonProps> = ({value, text, checked, onChange}) => (
    <label className={cx(style.wrapper, {[style.checked]: checked})}>
        <span className={style.button}>
            <input type="radio" className={style.input} {...{value, checked, onChange}}/>
        </span>
        <span>{text}</span>
    </label>
);


type GroupProps = {
    options: {value: string, text: string}[],
    value: string;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onMouseEnter?: any;
    onMouseLeave?: any;
};

const RadioGroup: React.SFC<GroupProps> = ({value, options, disabled, onChange}) => (
    <div className={style.group}>
    {
        options.map(p => (
            <RadioButton key={p.value} value={p.value} checked={p.value === value} disabled={!!disabled}
                         text={p.text} onChange={onChange}/>
        ))
    }
     </div>
);

export default RadioGroup;