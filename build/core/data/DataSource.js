"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _DataRepo = _interopRequireDefault(require("./DataRepo.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable camelcase */

/* eslint-disable valid-jsdoc */

/* eslint-disable no-unused-vars */

/* eslint-disable import/extensions */
// import Wallet from '../domain/WalletModel.js';

/**
@class DataSource
* */
class DataSource {
  /**
   *
   * @param {DataRepo} dataRepo;
   */
  constructor(dataRepo) {
    this.datarepo = dataRepo;
  } // TRANSACTIONS

  /**
   * @method
   * @returns String
   */


  async page(text, phoneNumber) {
    return this.datarepo.page(text, phoneNumber);
  }

}

var _default = DataSource;
exports.default = _default;