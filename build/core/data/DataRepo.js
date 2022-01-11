"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _HelperUtils = _interopRequireDefault(require("../../utils/HelperUtils"));

var _ussd = _interopRequireDefault(require("../domain/pages/ussd1"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-unused-vars */

/* eslint-disable camelcase */

/* eslint-disable valid-jsdoc */

/* eslint-disable max-len */

/* eslint-disable class-methods-use-this */

/**
 * @class
 */
class DataRepo {
  /**
   *
   * @param {string} text - text sent by the ussd service
   * @param {string} phoneNumber - phone number of the user
   */
  async page(text, phoneNumber) {
    try {
      let page = '';

      switch (text) {
        case '':
          page = await _ussd.default.page();
          break;

        case '1':
          page = await _ussd.default.page();
          break;

        default:
          break;
      }
    } catch (error) {
      return 'An error Just occurred';
    }
  }

}

var _default = DataRepo;
exports.default = _default;