"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ussdMenuBuilder = _interopRequireDefault(require("ussd-menu-builder"));

var _HelperUtils = _interopRequireDefault(require("../../../../utils/HelperUtils"));

var _games = _interopRequireDefault(require("../games"));

var _walletpages = _interopRequireDefault(require("../walletpages"));

var _mainServer = _interopRequireDefault(require("../../../data/APICALLS/mainServer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable require-jsdoc */

/* eslint-disable no-undef */
const sessions = {};

class WalletMenuBuilderHelper {
  static async walletMenus(args) {
    const menu = new _ussdMenuBuilder.default();
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
        console.log(`set ${key} to ${value}`); // store key-value pair in current session

        sessions[sessionId][key] = value;
        callback();
      },

      get(sessionId, key) {
        return new Promise((resolve, reject) => {
          const value = sessions[sessionId][key];
          resolve(value);
        });
      }

    }); // Define menu states

    menu.startState({
      run: () => {
        // use menu.con() to send response without terminating session
        menu.con('Welcome, Please click submit to continue');
      },
      next: {
        '*\\d+': 'wallet.amount'
      }
    });
    menu.state('wallet.amount', {
      run: () => {
        // use menu.con() to send response without terminating session
        menu.con(_walletpages.default.amountPage());
      },
      next: {
        '*\\d+': 'wallet.account'
      }
    }); // // nesting states

    menu.state('wallet.account', {
      run: () => {
        // use menu.val to access user input value
        const amountEntered = menu.val;
        menu.session.set('amount', amountEntered);
        menu.con(_walletpages.default.accountPage());
      },
      next: {
        '*\\d+': 'wallet.bank'
      }
    });
    menu.state('wallet.bank', {
      run: async () => {
        // use menu.val to access user input value
        const accountNumber = menu.val;
        menu.session.set('accountNumber', accountNumber); // TODO: get bank list from db and display by pages

        const response = await _mainServer.default.getBankLists();

        if (response.message === 'success') {
          if (response.data.length > 0) {
            menu.session.set('bankList', response.data);
            let banks = '';
            response.data.forEach(element => {
              banks += `${response.data.indexOf(element) + 1}.${element.name}\n`;
            });
            console.log('banks', banks);
            menu.con(`please select a bank
            ${banks}
             98. Main Menu
             99. Exit`);
          } else {
            menu.con(`No bank available for now.
             98. Main Menu
             99. Exit`);
          }
        } // there will be a state that will check if there is more values to display
        // if there is, it will display the next page using this same state
        // menu.con(WalletPages.bankPage());

      },
      next: {
        '*\\d+': 'wallet.details'
      }
    });
    menu.state('wallet.bankCheck', {
      run: () => {
        // this will be a state that will check if there is more values to display
        // if there is, it will display the next page using this same state
        menu.con(_walletpages.default.bankPage());
      },
      next: {
        '*\\d+': 'wallet.account'
      }
    }); // // nesting states

    menu.state('wallet.details', {
      run: async () => {
        const input = menu.val;
        const accountNumber = await menu.session.get('accountNumber');
        const amount = await menu.session.get('amount');
        const bankSelected = await menu.session.get('bankList');
        const bank = bankSelected[input - 1]; // check the details of the user's account

        const bankCode = bank.code;
        menu.con(`Kindly confirm your details before proceeding.
        Account Number: ${accountNumber}
        Amount: ${amount}
        Bank: ${bank.name}
        
        1. Confirm
        2. Edit
        98. Main Menu
        99. Exit`);
      },
      next: {
        1: 'wallet.feedback',
        2: 'wallet.amount'
      }
    }); // nesting states

    menu.state('wallet.feedback', {
      run: async () => {
        // use menu.val to access user input value
        const input = menu.val; // check the details of the user's account

        const accountNumber = await menu.session.get('accountNumber');
        const amount = await menu.session.get('amount');
        const bankSelected = await menu.session.get('bankList');
        const bank = bankSelected[input - 1]; // check the details of the user's account

        const bankCode = bank.code; // send withdrawal request to the server

        const body = {
          accountNumber,
          amount,
          bankCode
        };
        const response = await _mainServer.default.createWithdrawal(body);

        if (response.message === 'success') {
          menu.con(`Your withdrawal request has been sent to the bank.
          Thank you for using our services.
          98. Main Menu
          99. Exit`);
        } else {
          menu.con(`Withdrawal Not successful
          ${response.message}
          Thank you for using our service
          98. Main Menu
          99. Exit`);
        }
      }
    });
    const page = await menu.run(args);
    console.log('this is page ', page);
    return page;
  }

}

var _default = WalletMenuBuilderHelper;
exports.default = _default;