/**
 *  Send response message
 *
 * @param {object} res - response object
 * @param {number} status - http status code
 * @param {string} statusMessage - http status message
 * @param {object} data - response data
 *
 * @returns {object} returns response
 *
 */
export const responseHandler = (res, code, statusMessage, data) =>
  res.status(code).json({
    data,
    code,
    message: statusMessage
  });

  /**
 * Unlike `traverse`, mapConcurrently runs the process in parallel
 * (actually concurrently), and combines their results into one promise.
 * i.e `traverse` for sequential asynchronous actions, `mapConcurrently`
 * for parallel actions.
 * @param ts array to transform
 * @param fn async function to make transformation
 */
export async function mapConcurrently<T, U>(ts: T[], fn: (t: T) => Promise<U>): Promise<U[]> {
  return Promise.all(ts.map(fn));
}

/**
 * Like `mapConcurrently` but with no need to return an array. Basically a parallel
 * `forEach`
 * @param ts array to transform
 * @param fn async function to make transformation
 */
export async function loopConcurrently<T, U>(ts: T[], fn: (t: T) => Promise<void>): Promise<void> {
  const promises = [];
  ts.forEach(x => promises.push(fn(x)));
  await Promise.all(promises);
}
