import {isEqual} from './iter';

// memoize only the result of the last call of a function
export const memoize = fn => {
    let previousArgs = undefined;
    let previousRes = undefined;
    
    return (...args) => {
        if (previousArgs && isEqual(args, previousArgs))
            return previousRes;
        else {
            const res = fn(...args);
            previousArgs = args;
            previousRes = res;
            return res;
        }
    }
}
