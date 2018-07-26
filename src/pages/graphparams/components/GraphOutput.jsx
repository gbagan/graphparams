import {contains, range} from '@fp';
import {connect, createSelector, pick, React} from '@/commonreact';
import {selector} from '../redux';

const colors = ['blue', 'red', 'green', 'cyan', 'magenta', 'orange', 'gray', 'black', 'yellow' ];

const GraphOutput = ({graph, edges, className, layout, nodeColors, selectedEdges}) => {
    const layout2 = layout && layout.map(({x, y}) => ({ x: 900 * x + 50, y: 900 * y + 50 }));
    return (
        <svg viewBox="0 0 1000 1000" className={className}>
            {edges && edges.map(([from, to]) =>
                <line
                    key={'edge' + from + '-' + to}
                    x1={layout2[from].x}
                    y1={layout2[from].y}
                    x2={layout2[to].x}
                    y2={layout2[to].y}
                    stroke={contains({from, to}, selectedEdges) ? 'red' : 'blue'}
                    strokeWidth="6"
                />
            )}
            {graph && range(0, graph.length).map(i =>
                <circle
                    key={'node' + i}
                    cx={layout2[i].x}
                    cy={layout2[i].y}
                    r={30}
                    fill={colors[nodeColors[i]]}
                    stroke="blue"
                    strokeWidth="3"
                />
            )}
        </svg>
    );

};

export default
connect(
    createSelector(selector, pick('graph,edges,layout,witness,nodeColors,selectedEdges'))
)(GraphOutput);