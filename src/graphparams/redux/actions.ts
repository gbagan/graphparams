import {createAction, createStandardAction} from 'typesafe-actions';
import {Witness, PlainGraph, GraphParameter} from '../types';

export const changeCode = createStandardAction('params/CHANGE_CODE')<string>();
export const toggleParameter = createStandardAction('params/TOGGLE_PARAMETER')<string>();
export const selectAll = createAction('params/SELECT_ALL');
export const unselectAll = createAction('params/UNSELECT_ALL');
export const skip = createAction('params/SKIP');

export const asyncCompute = createAction('params/ASYNC_COMPUTE');
export const startComputing = createAction('params/START_COMPUTING');
export const finishComputing = createAction('params/FINISH_COMPUTING');
export const graphComputed = createStandardAction('params/GRAPH_COMPUTED')<PlainGraph>();
export const computeGraphError = createStandardAction('params/GRAPH_COMPUTE_ERROR')<string>();
export const startComputingParameter= createStandardAction('params/START_COMPUTING_PARAMETER')<string>();
export const parameterComputed = createStandardAction('params/PARAMETER_COMPUTED')<GraphParameter>();

export const showWitness = createStandardAction('params/SHOW_WITNESS')<Witness|null>();