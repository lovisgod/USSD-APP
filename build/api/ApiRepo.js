"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _DataRepo = _interopRequireDefault(require("../core/data/DataRepo"));

var _DataSource = _interopRequireDefault(require("../core/data/DataSource"));

var _Statuscode = _interopRequireDefault(require("../ErrorHelpers/Statuscode"));

var _sendResponses = require("../utils/sendResponses");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable camelcase */

/* eslint-disable valid-jsdoc */

/* eslint-disable class-methods-use-this */

/**
@module ApiRepo
* */
// import GeneralError from '../ErrorHelpers/GeneralError';

/**
@class
* */
class ApiRepo {
  /**
   * @constructor
   */
  constructor() {
    this.dataRepo = new _DataRepo.default();
    this.dataSource = new _DataSource.default(this.dataRepo);
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
        return res.status(_Statuscode.default.OK).download('./logs/app.log');
      }

      return res.status(_Statuscode.default.FORBIDDEN).send('<h1>Access Denied</h1>');
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
        _fs.default.readFile('./logs/app.log', 'utf8', (readErr, logs) => {
          try {
            if (readErr) throw readErr; // Append content of app.log to app_dump.log

            _fs.default.appendFile('./logs/app_dump.log', logs, appendErr => {
              if (appendErr) throw appendErr;
            }); // Clear content of app.log


            _fs.default.writeFile('./logs/app.log', '', writeErr => {
              if (writeErr) throw writeErr;
            });
          } catch (error) {
            console.error(error);
          }
        });

        return (0, _sendResponses.sendSuccessResponse)(res, 200, 'Logs dumped succesfully');
      }

      return res.status(_Statuscode.default.FORBIDDEN).send('<h1>Access Denied</h1>');
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
  /**
   *
   * @method
   * @param {Request} req
   * @param {Response} res
   * @param {import('express').NextFunction} next
   * @returns Response
   */


  async ussd(req, res, next) {
    try {
      const {
        sessionId,
        serviceCode,
        phoneNumber,
        text
      } = req.body;
      const args = {
        phoneNumber: req.body.phoneNumber,
        sessionId: req.body.sessionId,
        serviceCode: req.body.serviceCode,
        text: req.body.text
      };
      console.info(`sessionId: ${sessionId}`);
      console.info(`serviceCode: ${serviceCode}`);
      console.info(`phoneNumber: ${phoneNumber}`);
      console.info(`text: ${text}`);
      const repo = new ApiRepo();
      const response = await repo.dataSource.page(text, phoneNumber, args);
      console.log(response);
      res.send(response);
    } catch (error) {
      return next(error);
    }
  }

}

var _default = ApiRepo;
exports.default = _default;