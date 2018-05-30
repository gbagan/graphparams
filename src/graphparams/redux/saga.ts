import { call, put, takeEvery, select } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import PromiseWorker from 'promise-worker';

import * as actions from './actions';
import selector from './selector';
import { State } from './reducer';
import { PlainGraph, GraphParameter } from "../types"
import GraphWorker from 'worker-loader!./worker';

const worker = new GraphWorker();
const promiseWorker = new PromiseWorker(worker);
promiseWorker.postMessage = promiseWorker.postMessage.bind(promiseWorker);

function* computeGraph(action: ReturnType<typeof actions.asyncCompute>) {
    yield put(actions.startComputing());
    const state: State = yield select(selector); ////////
    const result = yield call(promiseWorker.postMessage, { type: 'graph', code: state.code });
    if (result.type === "error") {
        yield put(actions.computeGraphError(result.error));
    } else {
        const graph = result.graph as PlainGraph
        yield put(actions.graphComputed(graph));
        for (const param of state.parameters.filter(p => p.checked)) {
            yield put(actions.startComputingParameter(param.name));
            const param2 = yield call(promiseWorker.postMessage, { type: 'param', graph, param });
            const param3 = normalize(param2) as GraphParameter;
            yield put(actions.parameterComputed(param3))
        }
    }
    yield put(actions.finishComputing());
}

export default function* saga() {
    yield takeEvery(getType(actions.asyncCompute), computeGraph);
}


const normalize = (param: any) => param.result && param.result.result === 'Infinity'
                                ? { ...param, result: { result: Infinity, witness: param.result.witness }}
                                : param 