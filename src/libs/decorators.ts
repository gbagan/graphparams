/*
export function log(target: Object, name: string, descriptor: TypedPropertyDescriptor<any>) {
    const originalMethod = descriptor.value; // save a reference to the original method
    descriptor.value = function(...args: any[]) {
        console.log(`${name} called with arguments: `, ...args);
        const result = originalMethod.apply(this, args);
        console.log(`${name} returns `, result);
        return result;
    };
    return descriptor;
}
*/

function isEqual(args: any[], args2: any[]) {
    for (let i = 0; i < args.length; i++) {
        if (args[i] !== args2[i]) {
            return false;
        }
    }
    return true;
}

// memoize only the result of the last call of a function, the cache can be cleared
export function memoize(fn: any) {
    const fn2: any = (...args: any[]) => {
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
