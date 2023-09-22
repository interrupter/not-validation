/**
 * Test argument type to be 'function'
 * @param {any}  func    possible function
 * @return {boolean}     if this is a function
 **/
const isFunc = (func) => {
    return typeof func === "function";
};

/**
 * Returns true if argument is Async function
 * @param {function} func  to test
 * @return {boolean}       if this function is constructed as AsyncFunction
 **/
const isAsync = (func) => {
    return func.constructor.name === "AsyncFunction";
};

module.exports = async (proc, params) => {
    if (isFunc(proc)) {
        if (isAsync(proc)) {
            return await proc(...params);
        } else {
            return proc(...params);
        }
    }
};
