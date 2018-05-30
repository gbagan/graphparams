import * as React from 'react';

import {Solution} from '../types.d';

interface Props {
    index: number,
    solution: Solution,
    onSelect: (solution: Solution | null) => void;
}

const OutputSolution: React.SFC<Props> = (props) => {
    const { index, solution, onSelect } = props;
    return (
        <a href="#" onMouseOver={() => onSelect(solution)} onMouseOut={() => onSelect(null)}>solution {index + 1}</a>
    );
}

export default OutputSolution;