import register from 'promise-worker/register';

import { WorkerAction } from "../types";
import { fromPlainObject } from "../../libs/graph/graph"
import parse from "../../libs/graph/graphparser"


register((action: WorkerAction) => {
    if (action.type === 'graph') {
        const result = parse(action.code);
        return typeof result === "string" ? { type: 'error', error: result } : { type: 'graph', graph: result.toPlainObject() };
    } else if (action.type === 'param') {
        const graph = fromPlainObject(action.graph);
        const methodName = action.param.method;
        const result = (graph as any)[methodName]();
        const result2 = (typeof result === 'boolean' || typeof result === 'number')
            ? { result: result, witness: null } : result;
        const result3 = result2.result === Infinity ? { result: 'Infinity', witness: result2.witness} : result2;

        return { ...action.param, result: result3 }
    }
    return null;
});