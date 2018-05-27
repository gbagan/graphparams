import { call, put, takeEvery, select } from 'redux-saga/effects';
import { getType } from 'typesafe-actions';
import PromiseWorker from 'promise-worker';
import * as actions from './actions';
import selector from './selector';
import {State} from './reducer';
import { PlainGraph } from "../../libs/graph/graph"
import GraphWorker from 'worker-loader!./worker';

const worker = new GraphWorker();
const promiseWorker = new PromiseWorker(worker);

export function* computeGraph(action: ReturnType<typeof actions.computeGraphRequest>) {
    const state: State = yield select(selector); ////////
    const graph: PlainGraph = yield call(promiseWorker.postMessage, { type: 'graph', code: state.code });
    console.log("saga, graph", graph);
    yield put(actions.computeGraphSuccess(graph));
}

export default function* saga() {
    yield takeEvery(getType(actions.computeGraphRequest), computeGraph);
}