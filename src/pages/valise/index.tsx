import { cxbind, React, withHandlers, withStateHandlers } from "@/commonreact";
import { compose } from "recompose";
import { CSSTransition } from 'react-transition-group';

const style = require("./style.scss");
const cx = cxbind(style);

type State = {
    isOpen: boolean;
};

type StateHandlers = {
    open: () => Partial<State>;
    close: () => Partial<State>;
};

type Handlers = {
    handleMouseIn: () => void;
    handleMouseOut: () => void;
};

const render: React.SFC<State & StateHandlers & Handlers> = ({ open, isOpen, handleMouseIn, handleMouseOut }) => (
    <div className={cx("container")}>
        <CSSTransition
            in={isOpen}
            timeout={300}
            classNames={{
                enterActive: cx("enter-active"),
            }}
        >
            <div className={cx("valise", { open: isOpen })}
                onClick={open} onMouseOver={handleMouseIn} onMouseOut={handleMouseOut}
            />
        </CSSTransition>
    </div>
);

export default
    compose<State & StateHandlers & Handlers, {}>(
        withStateHandlers<State, StateHandlers, {}>({
            isOpen: false,
        }, {
                close: () => () => ({ isOpen: false }),
                open: () => () => ({ isOpen: true }),
            }),
        withHandlers<State & StateHandlers, Handlers>(
            () => {
                let timeout: number | null = null;
                return {
                    handleMouseIn: ({ open }) => () => {
                        if (timeout !== null)
                            clearTimeout(timeout);
                        timeout = null;
                    },
                    handleMouseOut: ({ close }) => () => {
                        timeout = window.setTimeout(close, 1000);
                    }
                }
            }
        )
    )
        (render);
