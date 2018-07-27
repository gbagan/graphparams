import {createAction} from '@/commonreact';

const actions = {
    selectVertex: createAction('eds/SELECT-VERTEX'),
    submitInput: createAction('eds/SUBMIT-INPUT')
};

export default actions;
