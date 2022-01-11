"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sendResponses = require("../utils/sendResponses.js");

var _BaseError = _interopRequireDefault(require("./BaseError.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable import/extensions */

/**
 * @class
 */
class ErrorHandler {
  /**
   *
   * @param {Error} err
   * @param {Response} res
   */
  static async handleError(err, res) {
    if (err instanceof _BaseError.default) {
      await (0, _sendResponses.sendErrorResponse)(res, err.httpCode, err.message);
    }
  }
  /**
   *
   * @param {Error} error
   * @returns Boolean
   */


  static isTrustedError(error) {
    if (error instanceof _BaseError.default) {
      return error.isOperational;
    }

    return false;
  }

}

var _default = ErrorHandler;
exports.default = _default;