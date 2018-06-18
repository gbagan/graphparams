import {cxbind, React, withHandlers} from "@/commonreact";
const style = require("./InputNumber.scss");
const cx = cxbind(style);

type Props = {
    className?: string;
    value?: number;
    min?: number;
    max?: number;
    name?: string;
    onChange?: (value: number) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

type Handlers = {
    increment: () => void;
    decrement: () => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

// span unselectable=unselectable

const render: React.SFC<Props & Handlers> = ({className, children, value,
                                              increment, decrement, handleChange, ...rest}) => (
    <div className={style.inputnumber}>
        <div className={style.handlerwrap}>
            <span
                role="button"
                onClick={increment}
                className={cx("handler", "handlerup", {disabled: value === rest.max})}
            >
                <span className={cx("inner")} />
            </span>
            <span
                role="button"
                onClick={decrement}
                className={cx("handler", "handlerdown", {disabled: value === rest.min})}
            >
                <span className={style.inner} />
            </span>
        </div>
        <div className={style.inputwrap} role="spinbutton">
            <input  {...rest} className={style.input} value={value} onChange={handleChange} />
        </div>
    </div>
)

export default
withHandlers<Props, Handlers>({
    decrement:  ({onChange, value, min}) => () => value !== min && value !== undefined && onChange && onChange(value-1),
    increment: ({onChange, value, max}) => () => value !== max && value !== undefined && onChange && onChange(value+1),
    handleChange: ({onChange}) => e => onChange && onChange(parseInt(e.target.value, 10))
})(render);