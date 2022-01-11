"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _WistonLogger = _interopRequireDefault(require("../../ErrorHelpers/WistonLogger"));

var _GeneralError = _interopRequireDefault(require("../../ErrorHelpers/GeneralError"));

var _sendResponses = require("../../utils/sendResponses");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable valid-jsdoc */

/**
 *
 * Description. (This module handles token validation globaly in the app)
 *
 * @file   authmid
 * @author Ayooluwa Olosunde.
 * @since  24.05.2021
 */

/**
 * @param {Request} req
 * @param {Response} next
 * @param {import('express').NextFunction} res
 * @returns Response
 */
var _default = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return (0, _sendResponses.sendErrorResponse)(res, 401, 'Authentication required');
    }

    const token = req.headers.authorization.split(' ')[1] || req.headers.authorization || req.headers.cookie.split('=')[1];
    if (!token) return (0, _sendResponses.sendErrorResponse)(res, 401, 'Access Denied'); // const { uuid } = verifyToken(token);
    // this step is not neccesary as the token will be coming from the api gateway
    // so we may have to get the user value from the token directly
    // here we will be making call IAMAuth service to check user data

    const authserviceBaseUrl = 'http://iamauthenticationapi-dev.us-east-2.elasticbeanstalk.com/api/v1/AuthenticationService'; // console.log(`${authserviceBaseUrl}/ValidateJWToken?token=${token}`);

    const validationResponse = await (0, _axios.default)({
      method: 'post',
      url: `${authserviceBaseUrl}/ValidateJWToken?token=${token}`,
      data: {}
    }); // console.log({ validationResponseData: validationResponse.data });

    _WistonLogger.default.error(`${JSON.stringify(validationResponse.data)}`);

    if (validationResponse && validationResponse.data && validationResponse.data.data !== null) {
      const {
        data
      } = validationResponse.data; // console.log(`Token is ${data ? 'valid' : 'invalid'}`);

      const {
        userId,
        role,
        firstname,
        lastname,
        email,
        phoneNumber
      } = data;
      req.user = {
        role,
        userUuid: userId.replace(/[–]/g, '-'),
        firstname: firstname || '',
        lastname: lastname || '',
        email,
        phoneNumber
      };
    } else {
      // Get message from auth service or use custom
      const resMessage = validationResponse.data ? validationResponse.data.responseMessage : 'Access Denied'; // Get code from auth service or use custom

      const resCode = validationResponse.data ? validationResponse.data.responseCode : 401;
      return (0, _sendResponses.sendErrorResponse)(res, resCode, resMessage);
    }

    req.token = token;
    next();
  } catch (err) {
    _WistonLogger.default.error(`${JSON.stringify(err.message)}`);

    console.log(err.code);
    let errCode = 500,
        errMessage = 'Authentication Failed';

    switch (true) {
      case err.code === 'ETIMEDOUT' || err.message.toLowerCase().includes('time'):
        errCode = 504;
        errMessage = 'Authentication Timedout! Try again';
        break;

      default:
        break;
    }

    const error = err.message ? new _GeneralError.default('AUTHFAIL', errCode, true, errMessage) : err;
    next(error);
  }
};

exports.default = _default;