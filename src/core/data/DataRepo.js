/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable valid-jsdoc */
/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */

import axios from 'axios';

import HelperUtils from '../../utils/HelperUtils';
import PageCode from '../domain/pagecode';
import RegisterPage from '../domain/pages/registerpage';
import Ussd1 from '../domain/pages/ussd1';

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
      if (text === '') {
        page = await Ussd1.page();
        return page;
      }
      const pagemenuToShow = text.split('*');
      const lastValueInTheBox = pagemenuToShow[pagemenuToShow.length - 1];
      const valuebeforeLastValueInTheBox = pagemenuToShow[pagemenuToShow.length - 2];
      if (pagemenuToShow.length === 1) {
        switch (pagemenuToShow[0]) {
          case '1':
            page = await this.registerMenu(pagemenuToShow, phoneNumber);
            break;
          case '6':
            page = 'END';
            break;
          default:
            page = 'END Invalid Input';
            break;
        }
      } else if (lastValueInTheBox === '98') {
        page = await Ussd1.page();
      } else if (lastValueInTheBox === '99') {
        page = 'END Thank you for using our service';
      } else if (lastValueInTheBox.length === 1) {
        switch (lastValueInTheBox) {
          case '1':
            page = await RegisterPage.page();
            break;
          case '6':
            page = 'END';
            break;
          default:
            page = 'END Invalid Input';
            break;
        }
      }
      // else {
      //   switch (pagemenuToShow[1]) {
      //     case '1':
      //       page = await this.registerMenu(pagemenuToShow, phoneNumber);
      //       break;
      //     default:
      //       page = 'END Invalid Input';
      //       break;
      //   }
      // }
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
      let page = await RegisterPage.page();
      const lastValueInTheBox = text[text.length - 1];
      if (this.validateEmail(text[0])) {
        const statusMessage = `Registration completed!
        Your ID is ${phoneNumber};
        Kindly note that this ID can be used to fund your Account directly from all Nigerian Banks`;
        page = `END ${statusMessage}`;
      } else {
        switch (lastValueInTheBox) {
          case PageCode.REGISTRATION_MENU_REGISTER.ACTIVATE:
            page = 'CON Kindly enter your email address';
            break;
          case PageCode.REGISTRATION_MENU_REGISTER.DEACTIVATE:
            page = 'CON Kindly enter your email address';
            break;
          case PageCode.REGISTRATION_MENU_REGISTER.MAIN_MENU:
            page = Ussd1.page();
            break;
          case PageCode.REGISTRATION_MENU_REGISTER.EXIT:
            page = 'END Thank you for using our service';
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

  validateEmail(emailAdress) {
    const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (emailAdress.match(regexEmail)) {
      return true;
    }
    return false;
  }
}

export default DataRepo;
