"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendSuccessResponse = exports.sendErrorResponse = void 0;

/**
   * @param {res} res
   * @param {code} code
   * @param {errorMessage} errorMessage description of error
   * @return response object {@link res}
   */
const sendErrorResponse = (res, code, errorMessage) => res.status(code).send({
  status: 'error',
  responsecode: code,
  responsemessage: errorMessage
});
/**
   * @param {res} res
   * @param {code} code
   * @param {data} data res data
   * @return response object {@link res}
   */


exports.sendErrorResponse = sendErrorResponse;

const sendSuccessResponse = (res, code, data) => res.status(code).send({
  status: 'success',
  responsecode: code,
  data
});

exports.sendSuccessResponse = sendSuccessResponse;