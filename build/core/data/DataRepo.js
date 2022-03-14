"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _HelperUtils = _interopRequireDefault(require("../../utils/HelperUtils"));

var _pagecode = _interopRequireDefault(require("../domain/pagecode"));

var _games = _interopRequireDefault(require("../domain/pages/games"));

var _GamemenuBuilderHelper = _interopRequireDefault(require("../domain/pages/menus/GamemenuBuilderHelper"));

var _playgamefirstmenu = _interopRequireDefault(require("../domain/pages/menus/playgamefirstmenu"));

var _WalletmenuBuilderHelper = _interopRequireDefault(require("../domain/pages/menus/WalletmenuBuilderHelper"));

var _registerpage = _interopRequireDefault(require("../domain/pages/registerpage"));

var _ussd = _interopRequireDefault(require("../domain/pages/ussd1"));

var _mainServer = _interopRequireDefault(require("./APICALLS/mainServer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable require-jsdoc */

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
  async page(text, phoneNumber, args) {
    try {
      let page = '';

      if (text === '') {
        page = await _ussd.default.page();
        return page;
      }

      const pagemenuToShow = text.split('*');
      const lastValueInTheBox = pagemenuToShow[pagemenuToShow.length - 1];
      const valuebeforeLastValueInTheBox = pagemenuToShow[pagemenuToShow.length - 2];

      if (lastValueInTheBox === '98') {
        page = await _ussd.default.page();
      } else if (lastValueInTheBox === '99') {
        page = 'END Thank you for using our service';
      } else if (pagemenuToShow.length === 1) {
        switch (lastValueInTheBox) {
          case '1':
            page = await _registerpage.default.page();
            break;

          case '2':
            page = await _ussd.default.comingSoonPage();
            break;

          case '3':
            page = await _WalletmenuBuilderHelper.default.walletMenus(args);
            break;

          case '4':
            page = await _GamemenuBuilderHelper.default.gameMenus(args, false);
            break;

          case '5':
            page = await _GamemenuBuilderHelper.default.gameMenus(args, true);
            break;

          case '6':
            page = 'END';
            break;

          default:
            page = 'END Invalid Input';
            break;
        }
      } else {
        switch (pagemenuToShow[0]) {
          case '1':
            page = await this.registerMenu(pagemenuToShow, phoneNumber);
            break;

          case '3':
            page = await _WalletmenuBuilderHelper.default.walletMenus(args);
            break;

          case '4':
            page = await _GamemenuBuilderHelper.default.gameMenus(args, false);
            break;

          case '5':
            page = await _GamemenuBuilderHelper.default.gameMenus(args, true);
            break;

          case '6':
            page = 'END';
            break;

          default:
            page = 'END Invalid Input';
            break;
        }
      }

      return page;
    } catch (error) {
      return 'END An error Just occurred';
    }
  }
  /**
   *
   * @param {string} text - text sent by the ussd service
   * @param {string} phoneNumber - phone number of the user
   */


  async registerMenu(text, phoneNumber) {
    try {
      let page = await _registerpage.default.page();
      const lastValueInTheBox = text[text.length - 1];
      console.log(phoneNumber);
      console.log(lastValueInTheBox);

      if (this.validateEmail(lastValueInTheBox)) {
        // make a post request to the server
        const response = await _mainServer.default.register({
          phoneNumber,
          email: lastValueInTheBox
        }); // const statusMessage = `Registration completed!
        // Your ID is ${phoneNumber};
        // Kindly note that this ID can be used to fund your Account directly from all Nigerian Banks`;

        page = `${response}`;
      } else if (text.length === 1) {
        page = await _registerpage.default.page();
      } else {
        switch (lastValueInTheBox) {
          case _pagecode.default.REGISTRATION_MENU_REGISTER.ACTIVATE:
            page = 'CON Kindly enter your email address';
            break;

          case _pagecode.default.REGISTRATION_MENU_REGISTER.DEACTIVATE:
            page = 'CON Kindly enter your email address';
            break;

          case _pagecode.default.REGISTRATION_MENU_REGISTER.MAIN_MENU:
            page = _ussd.default.page();
            break;

          case _pagecode.default.REGISTRATION_MENU_REGISTER.EXIT:
            page = 'END Thank you for using our service';
            break;

          default:
            page = 'END Invalid Input';
            break;
        }
      }

      return page;
    } catch (error) {
      console.log(error);
      return 'END Registration failed. Please try again';
    }
  }

  validateEmail(emailAdress) {
    const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (emailAdress.match(regexEmail)) {
      return true;
    }

    return false;
  }

}

var _default = DataRepo;
exports.default = _default;