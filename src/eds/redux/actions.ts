import { createAction } from 'typesafe-actions';

import {GraphInputData} from '../types';

export const selectVertex = createAction('eds/SELECT-VERTEX', resolve => (vertex: number) => resolve(vertex));
export const submitInput = createAction('eds/SUBMIT-INPUT', resolve => (data: GraphInputData) => resolve(data));