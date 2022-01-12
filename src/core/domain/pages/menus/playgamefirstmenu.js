/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable require-jsdoc */
import GamePages from '../games.js';

class PlayGameMenu {
  /**
   *
   * @param {string} text - text sent by the ussd service
   * @param {string} phoneNumber - phone number of the user
   */
  static async menu(text, phoneNumber) {
    try {
      let page = '';
      page = GamePages.firstPage();
      if (text.length === 1) {
        page = GamePages.firstPage();
      } else {
          if (text.length === 2) {
            page = 
          }
      }
      return page;
    } catch (error) {
      return 'END An error Just occurred';
    }
  }
}

export default PlayGameMenu;
