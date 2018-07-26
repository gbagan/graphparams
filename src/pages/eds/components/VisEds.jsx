import {range} from '@fp';
import {edges} from '@/lib/graph/graph';
import {connect, createSelector, pick, React} from '@/commonreact';
import {actions, selector} from '../redux';

import POLICEMAN from '../img/policeman.svg';
import HOUSE from '../img/house.svg';
import style from '../css/viseds.scss';

const VisEds = ({ graph, guards, layout, className, onSelectVertex }) => {
    const layout2 = layout && layout.map(({x, y}) => ({ x: 900 * x + 50, y: 900 * y + 50 }));
    return (
        <svg viewBox="0 0 1000 1000" className={className}>
            {graph && edges(graph).map(([v1, v2]) =>
                <line
                    key={'edge' + v1 + '-' + v2}
                    x1={layout2[v1].x}
                    y1={layout2[v1].y}
                    x2={layout2[v2].x}
                    y2={layout2[v2].y}
                    stroke="blue"
                    stroke-width="6"
                />
            )}
            {graph && range(0, graph.V).map(i =>
                <image
                    key={'node' + i}
                    onClick={() => onSelectVertex(i)}
                    x={layout2[i].x - 45}
                    y={layout2[i].y - 45}
                    width={90}
                    height={90}
                    href={HOUSE}
                />
            )}
            {guards && guards.map((v, i) =>
                <image
                    key={'guard' + i}
                    className={style.guard}
                    transform={`translate(${layout2[v].x - 35}, ${layout2[v].y - 35})`}
                    width={70}
                    height={70}
                    href={POLICEMAN}
                />
            )}
        </svg>
    );
}

export default
connect(
    createSelector(selector, pick('graph,guards,shift,layout')), {
        onSelectVertex: actions.selectVertex
    }
)(VisEds);