import {createStandardAction} from 'typesafe-actions';
import {GraphInputData} from '../types';

export const selectVertex = createStandardAction('eds/SELECT-VERTEX')<number>();
export const submitInput = createStandardAction('eds/SUBMIT-INPUT')<GraphInputData>();