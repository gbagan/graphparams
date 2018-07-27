import {all} from '@fp';

// memoize only the result of the last call of a function
const memoize = fn => {
    let previousArgs = undefined;
    let previousRes = undefined;
    
    return (...args) => {
        if (previousArgs && args.length == previousArgs.length && all((v, i) => v === previousArgs[i], args))
            return previousRes;
        else {
            const res = fn(...args);
            previousArgs = args;
            previousRes = res;
            return res;
        }
    };
};

export default memoize;