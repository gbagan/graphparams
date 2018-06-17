import * as cx from "classnames";
import * as React from "react";
import {withStateHandlers, withHandlers, compose} from "recompose";

import Button from "./Button";

const style = require("./Dropdown.scss");

type ItemProps = {
    onClick?: () => void;
}

export const DropdownItem: React.SFC<ItemProps> = ({onClick, children}) => (
    <li onClick={onClick} className={style.item}>{children}</li>
)


type Props = {
    label: string;
}

type State = {
    isOpen: boolean;
}

type StateHandlers = {
    open: () => Partial<State>;
    close: () => Partial<State>;
}

type Handlers = {
    handleMouseIn: () => void;
    handleMouseOut: () => void;
}

const render: React.SFC<Props & State & StateHandlers & Handlers> = ({label, isOpen,
                                        handleMouseIn, handleMouseOut, close, children}) => (
    <div className={style.wrap}>
        <Button onMouseEnter={handleMouseIn} onMouseLeave={handleMouseOut}>{label}</Button>
        <div className={cx(style.dropdown, {[style.hidden]: !isOpen})}
             onMouseEnter={handleMouseIn} onMouseLeave={handleMouseOut}>
            <ul className={style.menu} onClick={close}>
                {children}
            </ul>
        </div>
    </div>
)

const Dropdown = compose<Props & State & StateHandlers & Handlers, Props>(
    withStateHandlers<State, StateHandlers, Props>({
        isOpen: false,
    },{
        close: () => () => ({isOpen: false}),
        open: () => () => ({isOpen: true}),
    }),
    withHandlers<Props & State & StateHandlers, Handlers>(
        () => {
            let timeout: number | null = null;
            return {
                handleMouseIn: ({isOpen, open}) => () => {
                    if (timeout !== null)
                        clearTimeout(timeout);
                    timeout = null;
                    open();
                },
                handleMouseOut: ({close}) => () => {
                    timeout = window.setTimeout(close, 300);
                }
            }
        }
    )
)(render);

export default Dropdown;