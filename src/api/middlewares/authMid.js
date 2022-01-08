/* eslint-disable valid-jsdoc */
/**
 *
 * Description. (This module handles token validation globaly in the app)
 *
 * @file   authmid
 * @author Ayooluwa Olosunde.
 * @since  24.05.2021
 */

import axios from 'axios';
import wiston from '../../ErrorHelpers/WistonLogger';
import GeneralError from '../../ErrorHelpers/GeneralError';
import { sendErrorResponse } from '../../utils/sendResponses';

/**
 * @param {Request} req
 * @param {Response} next
 * @param {import('express').NextFunction} res
 * @returns Response
 */

export default async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return sendErrorResponse(res, 401, 'Authentication required');
    }
    const token = req.headers.authorization.split(' ')[1]
    || req.headers.authorization
    || req.headers.cookie.split('=')[1];
    if (!token) return sendErrorResponse(res, 401, 'Access Denied');
    // const { uuid } = verifyToken(token);

    // this step is not neccesary as the token will be coming from the api gateway
    // so we may have to get the user value from the token directly
    // here we will be making call IAMAuth service to check user data
    const authserviceBaseUrl = 'http://iamauthenticationapi-dev.us-east-2.elasticbeanstalk.com/api/v1/AuthenticationService';

    // console.log(`${authserviceBaseUrl}/ValidateJWToken?token=${token}`);
    const validationResponse = await axios({
      method: 'post',
      url: `${authserviceBaseUrl}/ValidateJWToken?token=${token}`,
      data: {},
    });

    // console.log({ validationResponseData: validationResponse.data });

    wiston.error(`${JSON.stringify(validationResponse.data)}`);

    if (
      validationResponse
      && validationResponse.data
      && validationResponse.data.data !== null
    ) {
      const { data } = validationResponse.data;
      // console.log(`Token is ${data ? 'valid' : 'invalid'}`);

      const { userId, role, firstname, lastname, email, phoneNumber } = data;
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
      const resMessage = (validationResponse.data)
        ? validationResponse.data.responseMessage : 'Access Denied';
      // Get code from auth service or use custom
      const resCode = (validationResponse.data)
        ? validationResponse.data.responseCode : 401;

      return sendErrorResponse(res, resCode, resMessage);
    }
    req.token = token;
    next();
  } catch (err) {
    wiston.error(`${JSON.stringify(err.message)}`);
    console.log(err.code);

    let errCode = 500, errMessage = 'Authentication Failed';

    switch (true) {
      case err.code === 'ETIMEDOUT' || err.message.toLowerCase().includes('time'):
        errCode = 504;
        errMessage = 'Authentication Timedout! Try again';
        break;

      default:
        break;
    }

    const error = err.message ? new GeneralError('AUTHFAIL', errCode, true, errMessage)
      : err;
    next(error);
  }
};
