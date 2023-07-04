/**
 * @typedef {Object} ErrorDetails
 * @property {string} type
 * @property {string} title
 * @property {number} status
 * @property {string} detail
 * @property {string} instance
 * @property {string|number|Array|Object} [additionalProperty]
 */

export default class ProblemDetails {
  /** @param {ErrorDetails} options */
  constructor(options) {
    Object.assign(this, options);
  }
}
