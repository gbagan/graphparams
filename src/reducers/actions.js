import {createAction} from '@/commonreact';

const actions = {
    changeCode: createAction('params/CHANGE_CODE'),
    toggleParameter: createAction("params/TOGGLE_PARAMETER"),
    selectAll: createAction('params/SELECT_ALL'),
    unselectAll: createAction('params/UNSELECT_ALL'),
    skip: createAction('params/SKIP'),
    asyncCompute: createAction('params/ASYNC_COMPUTE'),
    startComputing: createAction('params/START_COMPUTING'),
    finishComputing: createAction('params/FINISH_COMPUTING'),
    graphComputed: createAction('params/GRAPH_COMPUTED'),
    computeGraphError: createAction('params/GRAPH_COMPUTE_ERROR'),
    startComputingParameter: createAction('params/START_COMPUTING_PARAMETER'),
    parameterComputed: createAction('params/PARAMETER_COMPUTED'),
    showWitness: createAction('params/SHOW_WITNESS'),
};

export default actions;
