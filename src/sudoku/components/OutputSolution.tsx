import * as React from 'react';

import {Solution } from '../types';

interface Props {
    index: number,
    solution: Solution,
    onSelect: (solution: Solution | null) => any;
}

const OutputSolution: React.SFC<Props> = (props) => {
    const { index, solution, onSelect } = props;
    const onMouseOver = onSelect !== undefined ? () => onSelect(solution) : undefined;
    const onMouseOut = onSelect !== undefined ? () => onSelect(null) : undefined;

    return (
        <a href="#" onMouseOver={onMouseOver} onMouseOut={onMouseOut}>solution {index + 1}</a>
    );
}

export default OutputSolution;