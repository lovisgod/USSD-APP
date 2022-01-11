"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/**
 * @class
 *
 */
class BankAccount {
  /**
   *
   * @param {string} first_name
   * @param {string} last_name
   * @param {string} authorization_code
   * @param {string} bin
   * @param {string} last4
   * @param {string} exp_month
   * @param {string} exp_year
   * @param {string} userUuid
   * @param {string} channel
   * @param {string} bank
   * @param {string} country_code
   * @param {string} country_code
   * @param {string} brand
   * @param {boolean} reusable
   * @param {string} signature
   * @param {string} account_name
   * @param {string} email
   * @param {string} customer_code
   */
  constructor(userUuid, authorization_code, bin, last4, exp_month, exp_year, channel, card_type, bank, country_code, brand, reusable, signature, account_name, first_name, last_name, email, customer_code) {
    this.userUuid = userUuid;
    this.first_name = first_name;
    this.last_name = last_name;
    this.account_name = account_name;
    this.authorization_code = authorization_code;
    this.bin = bin;
    this.last4 = last4;
    this.exp_month = exp_month;
    this.exp_year = exp_year;
    this.channel = channel;
    this.card_type = card_type ? card_type : "";
    this.bank = bank;
    this.country_code = country_code;
    this.brand = brand;
    this.reusable = reusable;
    this.signature = signature ? signature : "";
    this.email = email;
    this.customer_code = customer_code;
  }

}

var _default = BankAccount;
exports.default = _default;