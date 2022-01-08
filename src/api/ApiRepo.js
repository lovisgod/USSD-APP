/* eslint-disable camelcase */
/* eslint-disable valid-jsdoc */
/* eslint-disable class-methods-use-this */

/**
@module ApiRepo
* */
import fs from 'fs';
import DataRepo from '../core/data/DataRepo';
import DataSource from '../core/data/DataSource';
// import GeneralError from '../ErrorHelpers/GeneralError';
import HttpStatusCode from '../ErrorHelpers/Statuscode';
import {
  sendSuccessResponse,
  sendErrorResponse,
} from '../utils/sendResponses';

/**
@class
* */
class ApiRepo {
  /**
   * @constructor
   */
  constructor() {
    this.dataRepo = new DataRepo();
    this.dataSource = new DataSource(this.dataRepo);
    this.datasource = this.dataSource;
  }

  /**
   * @method
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Response
   */
  async getLogs(req, res, next) {
    try {
      const passkey = req.query.key;
      if (passkey && passkey === 'jaraadmin123') {
        // wiston.error(JSON.stringify(process.env))
        return res.status(HttpStatusCode.OK).download('./logs/app.log');
      }
      return res.status(HttpStatusCode.FORBIDDEN).send('<h1>Access Denied</h1>');
    } catch (error) {
      return next(error);
    }
  }

  /**
   * @method
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Response
   */
  async dumpLogs(req, res, next) {
    try {
      const passkey = req.body.key;
      if (passkey && passkey === 'jaraadmin123') {
        fs.readFile('./logs/app.log', 'utf8', (readErr, logs) => {
          try {
            if (readErr) throw readErr;

            // Append content of app.log to app_dump.log
            fs.appendFile('./logs/app_dump.log', logs, (appendErr) => {
              if (appendErr) throw appendErr;
            });

            // Clear content of app.log
            fs.writeFile('./logs/app.log', '', (writeErr) => {
              if (writeErr) throw writeErr;
            });
          } catch (error) {
            console.error(error);
          }
        });

        return sendSuccessResponse(res, 200, 'Logs dumped succesfully');
      }

      return res.status(HttpStatusCode.FORBIDDEN).send('<h1>Access Denied</h1>');
    } catch (error) {
      return next(error);
    }
  }


  /**
   *
   * @method
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Response
   */
  async healthCheck(req, res, next) {
    try {
      res.status(200).send({
        status: 'running',
        description: 'Service is up and running',
        statuscode: 200
      });
    } catch (error) {
      return next(error);
    }
  }


}

export default ApiRepo;
