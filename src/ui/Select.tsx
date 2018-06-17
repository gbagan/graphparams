import * as cx from "classnames";
import * as React from "react";
import {withHandlers, withStateHandlers} from "recompose";

const style = require("./Select.scss");

type Option = {
    value: string;
    label: string;
}

type OptionProps = {
    value: string;
    label: string;
    onClick?: (value: string) => void;
}

type OptionHandlers = {
    handleClick: () => void;
}

export const renderOption: React.SFC<OptionProps & OptionHandlers> = ({value, label, handleClick, children}) => (
    <li onClick={handleClick} className={style.item}>{label}</li>
)

const Option = withHandlers<OptionProps, OptionHandlers>({
    handleClick: ({onClick, value}) => () => onClick && onClick(value)
})(renderOption);

type Props = {
    value: string;
    options: Option[],
    onChange?: (val: any) => void;
}

type State = {
    isOpen: boolean;
}

type StateHandlers = {
    open: () => Partial<State>;
    close: () => Partial<State>;
}

const render: React.SFC<Props & State & StateHandlers> = ({value, options, isOpen,
                                    open, close, children, onChange}) => (
    <div className={cx(style.select, {[style.open]: isOpen})}>
        <div role="combobox" onClick={open} className={style.selection}>
            <div className={style.rendered}>
                <div className={style.selectedvalue}>{value}</div>
            </div>
            <span className={style.arrow}/>
        </div>
        <div className={cx(style.dropdown, {[style.hidden]: !isOpen})}>
            <ul role="listbox" className={style.menu} onClick={close}>
            {
                options.map(({value, label}) =>
                    <Option key={value} value={value} label={label} onClick={onChange} />
                )
            }
            </ul>
        </div>
    </div>
)

export default
withStateHandlers<State, StateHandlers, Props>({
    isOpen: false,
},{
    open: () => () => ({isOpen: true}),
    close: () => () => ({isOpen: false})
})(render);
