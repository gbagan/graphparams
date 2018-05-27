import {createAction, createStandardAction, createAsyncAction} from 'typesafe-actions';
import {PlainGraph} from '../../libs/graph/graph';

export const changeCode = createStandardAction('params/CHANGE-CODE')<string>();
export const toggleParameter = createStandardAction('params/TOGGLE-PARAMETER')<string>();
export const selectAll = createAction('params/SELECT-ALL');
export const unselectAll = createAction('params/UNSELECT-ALL');
export const compute = createAction('params/COMPUTE');
export const skip = createAction('params/SKIP');

const computeGraph = createAsyncAction('params/COMPUTE_GRAPH_REQUEST',
                                      'params/COMPUTE_GRAPH_SUCCESS',
                                       'params/COMPUTE_GRAPH_ERROR')<void, PlainGraph, string>();
export const computeGraphRequest = computeGraph.request;
export const computeGraphSuccess = computeGraph.success;

