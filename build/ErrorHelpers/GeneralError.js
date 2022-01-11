"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _BaseError = _interopRequireDefault(require("./BaseError.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable import/extensions */

/**
 * @class
 */
class GeneralError extends _BaseError.default {
  /**
   *
   * @param {string} name
   * @param {number} httpCode
   * @param {boolean} isOperational
   * @param {string} description
   */
  constructor(name, httpCode, isOperational, description = 'An error occured') {
    super(name, httpCode, isOperational, description);
  }

}

var _default = GeneralError;
exports.default = _default;