export {pick} from '@fp'
import classNames from 'classnames/bind'
export {default as React} from 'react'
export const cxbind = classNames.bind.bind(classNames)
export {connect} from 'react-redux'
export {createSelector} from 'reselect'
export {compose, lifecycle, pure, toClass, withHandlers, withState,
    withStateHandlers, withPropsOnChange, onlyUpdateForKeys} from 'recompose'

export const createAction = (type) => {
    const actionCreator = payload => {
        const action = { type }
        if (payload !== undefined)
            action.payload = payload
        return action
    }
    actionCreator.toString = () => type
    return actionCreator
}

export const handleActions = actions => (state, {payload, type}) =>
    actions.hasOwnProperty(type) ? actions[type](state, payload) : state
