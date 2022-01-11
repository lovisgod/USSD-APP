"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * @class
 */
class BaseError extends Error {
  /**
   *
   * @param {strig} name
   * @param {string} httpCode,
   * @param {string} isOperational,
   * @param {string} description,
   */
  constructor(name, httpCode, isOperational, description) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    this.message = description;
    Error.captureStackTrace(this);
  }

}

var _default = BaseError;
exports.default = _default;