"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _BaseError = _interopRequireDefault(require("./BaseError"));

var _Statuscode = _interopRequireDefault(require("./Statuscode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class
 */
class ServerError extends _BaseError.default {
  /**
   *
   * @param {string} name
   * @param {number} httpCode
   * @param {boolean} isOperational
   * @param {string} description
   */
  constructor(name, httpCode = _Statuscode.default.INTERNAL_SERVER, isOperational = false, description = 'internal server error') {
    super(name, httpCode, isOperational, description);
  }

}

var _default = ServerError;
exports.default = _default;