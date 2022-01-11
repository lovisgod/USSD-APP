"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* eslint-disable class-methods-use-this */

/* eslint-disable require-jsdoc */
class Ussd1 {
  /**
   * @method
   * @returns String
   */
  static async page() {
    return `1.Register\n
    2.Deposit\n
    3.Withdraw\n
    4.Play Games\n
    5.Play Booking Code\n
    6.Exit`;
  }

}

var _default = Ussd1;
exports.default = _default;