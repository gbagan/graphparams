import registerPromiseWorker from 'promise-worker/register';

import { fromPlainObject, PlainGraph } from "../../libs/graph/graph"
import parse from "../../libs/graph/graphparser"

registerPromiseWorker((action: any) => {
    if (action.type === 'graph') {
        const result = parse(action.code);
        const data = typeof result === "string" ?  { type: 'graph', error: result } : { type: 'graph', graph: result.toPlainObject() };
        return data;
    } else if (action.type === 'param') {
        const graph = fromPlainObject(action.graph as PlainGraph);
        const methodName = action.method as string;
        const res = (graph as any)[methodName]();
        const data = { type: 'result', task: action.task, result: res };
        return data;
    }
    return null;
});