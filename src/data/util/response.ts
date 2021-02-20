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
export const response = (res, code, statusMessage, data) =>
  res.status(code).json({
    data,
    code,
    message: statusMessage
  });
