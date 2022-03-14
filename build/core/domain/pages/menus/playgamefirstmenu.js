"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _games = _interopRequireDefault(require("../games.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable class-methods-use-this */

/* eslint-disable no-unused-vars */

/* eslint-disable import/extensions */

/* eslint-disable require-jsdoc */
class PlayGameMenu {
  /**
   *
   * @param {string} text - text sent by the ussd service
   * @param {string} phoneNumber - phone number of the user
   */
  static async menu(text, phoneNumber) {
    try {
      let page = '';
      page = _games.default.firstPage();

      if (text.length === 1) {
        page = _games.default.firstPage();
      }

      return page;
    } catch (error) {
      return 'END An error Just occurred';
    }
  }

}

var _default = PlayGameMenu;
exports.default = _default;