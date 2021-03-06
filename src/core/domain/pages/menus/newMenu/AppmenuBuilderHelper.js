/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable no-undef */
import UssdMenu from 'ussd-menu-builder';
import AppPages from './newPages/AppPages';
import GameMenuBuilder from '../GamemenuBuilderHelper';
import UserMenuBuilderHelper from './newPages/UsermenuBuilderHelper';
import WalletMenuBuilderHelper from './newPages/WalletmenuBuilderHelper';

const sessions = {};

class AppMenuBuilderHelper {
// static sessions = {};

  static async appMenus(args) {
    const menu = new UssdMenu();

    menu.sessionConfig({
      start(sessionId, callback) {
        // initialize current session if it doesn't exist
        // this is called by menu.run()
        if (!(sessionId in sessions)) sessions[sessionId] = {};
        callback();
      },
      end(sessionId, callback) {
        // clear current session
        // this is called by menu.end()
        delete sessions[sessionId];
        callback();
      },
      set: (sessionId, key, value, callback) => {
        console.log(`set ${key} to ${value}`);
        // store key-value pair in current session
        sessions[sessionId][key] = value;
        callback();
      },

      get(sessionId, key) {
        return new Promise((resolve, reject) => {
          const value = sessions[sessionId][key];
          resolve(value);
        });
      }

    });
    // Define menu states
    menu.startState({
      run: () => {
        // use menu.con() to send response without terminating session
        menu.con(AppPages.firstPage());
      },
      // next object links to next state based on user input
      next: {
        1: 'Register',
        2: 'Withdraw',
        3: 'Play Games',
        4: 'Check Result',
        99: 'Exit'

      }
    });

    GameMenuBuilder.gameMenus(args, false, menu);
    UserMenuBuilderHelper.menus(args, menu);
    WalletMenuBuilderHelper.walletMenus(menu, args);

    const page = await menu.run(args);
    return page;
  }
}

export default AppMenuBuilderHelper;
