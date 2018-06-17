import { createAction, createStandardAction} from "typesafe-actions";
import { GraphParameter, PlainGraph } from "../types";

const actions = {
    changeCode: createStandardAction("params/CHANGE_CODE")<string>(),
    toggleParameter: createStandardAction("params/TOGGLE_PARAMETER")<string>(),
    selectAll: createAction("params/SELECT_ALL"),
    unselectAll: createAction("params/UNSELECT_ALL"),
    skip: createAction("params/SKIP"),
    asyncCompute: createAction("params/ASYNC_COMPUTE"),
    startComputing: createAction("params/START_COMPUTING"),
    finishComputing: createAction("params/FINISH_COMPUTING"),
    graphComputed: createStandardAction("params/GRAPH_COMPUTED")<PlainGraph>(),
    computeGraphError: createStandardAction("params/GRAPH_COMPUTE_ERROR")<string>(),
    startComputingParameter: createStandardAction("params/START_COMPUTING_PARAMETER")<string>(),
    parameterComputed: createStandardAction("params/PARAMETER_COMPUTED")<GraphParameter>(),
    showWitness: createStandardAction("params/SHOW_WITNESS")<GraphParameter | null>(),
};

export default actions;
