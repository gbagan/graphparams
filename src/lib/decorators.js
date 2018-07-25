import {isEqual} from './iter';


// memoize only the result of the last call of a function, the cache can be cleared
export const memoize = fn => {
    const fn2 = (...args) => {
        if (fn2.__cache && isEqual(fn2.__cache.args, args)) {
            return fn2.__cache.result;
        }
        const result = fn(...args);
        fn2.__cache = { args, result };
        return result;
    };
    fn2.__cache = null;
    fn2.clearCache = () => fn.__cache = null;
    return fn2;
}
