import {range} from '@fp';
import React from 'react';
import ConsoleNum from './ConsoleNum';
import style from '../css/Console.scss';

const Console = ({cols, onClick}) => (
    <div className={style.container}>
        <div className={style.console}>
        {
            range(1, cols * cols + 1).concat(0).map(i =>
                <ConsoleNum key={i} value={i} cols={cols} onClick={onClick} />
            )
        }
        </div>
    </div>
);

export default Console;
