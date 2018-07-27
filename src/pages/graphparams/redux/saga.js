import PromiseWorker from 'promise-worker';
import {call, put, select, takeEvery} from 'redux-saga/effects';

import GraphWorker from 'worker-loader!./worker';
import actions from './actions';
import selector from './selector';

const worker = new GraphWorker();
const promiseWorker = new PromiseWorker(worker);
promiseWorker.postMessage = promiseWorker.postMessage.bind(promiseWorker);

function* computeGraph() {
    yield put(actions.startComputing());
    const state = yield select(selector);
    const result = yield call(promiseWorker.postMessage, { type: 'graph', code: state.code });
    if (result.type === 'error') {
        yield put(actions.computeGraphError(result.error));
    } else {
        const graph = result.graph;
        yield put(actions.graphComputed(graph));
        for (const param of state.parameters.filter(p => p.checked)) {
            yield put(actions.startComputingParameter(param.name));
            const param2 = yield call(promiseWorker.postMessage, { type: 'param', graph, param });
            const param3 = normalize(param2);
            yield put(actions.parameterComputed(param3));
        }
    }
    yield put(actions.finishComputing());
}

export default function* saga() {
    yield takeEvery(actions.asyncCompute, computeGraph);
}

const normalize = param => param.result && param.result !== 'computing'  && param.result.result === -1
                                ? { ...param, result: { result: Infinity, witness: param.result.witness }}
                                : param;
