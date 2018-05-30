import * as React from 'react';
import ConsoleNum from './ConsoleNum';
import * as iter from '../../libs/iter';

interface Props {
    readonly cols: number;
    readonly onClick: (val: number) => void;
}

const Console: React.SFC<Props> = props => {
    const { cols, onClick } = props;

    return (
        <div className="console-container">
            <div className="console">
                {
                    Array.from(iter.range(1, cols * cols + 1)).concat(0).map(i =>
                        <ConsoleNum key={i} value={i} cols={cols} onClick={onClick} />
                    )
                }
            </div>
        </div>
    )
}

export default Console