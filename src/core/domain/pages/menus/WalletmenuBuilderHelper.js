/* eslint-disable require-jsdoc */
/* eslint-disable no-undef */
import UssdMenu from 'ussd-menu-builder';
import HelperUtils from '../../../../utils/HelperUtils';
import GamePages from '../games';
import WalletPages from '../walletpages';

const sessions = {};

class WalletMenuBuilderHelper {
  static async walletMenus(args) {
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
        menu.con(WalletPages.amountPage());
      },
      next: {
        '*\\d+': 'wallet.account',
      }
    });

    // // nesting states
    menu.state('wallet.account', {
      run: () => {
        // use menu.val to access user input value
        const amountEntered = menu.val;
        menu.session.set('amount', amountEntered);
        menu.con(WalletPages.accountPage());
      },
      // next: {
      //   '*\\d+': 'Withdrawal.details'
      // }
    });

    // // nesting states
    // menu.state('Withdrawal.details', {
    //   run: () => {
    //     // use menu.val to access user input value
    //     const code = menu.val;
    //     menu.session.set('accountNumber', code);
    //     // check the details of the user's account
    //     menu.session.get('accountNumber').then((accountNumber) => {
    //       menu.session.get('amount').then((amount) => {
    //         menu.con(`Your account number is 
    //         ${accountNumber} and the amount is ${amount}\n
    //         Do you want to proceed?
    //         1. Yes
    //         2. No`);
    //       });
    //     });
    //   },
    //   next: {
    //     1: 'Withdrawal.feedback',
    //     2: 'Withdrawal.feedback'
    //   }
    // });

    // // nesting states
    // menu.state('Withdrawal.feedback', {
    //   run: () => {
    //     // use menu.val to access user input value
    //     const decision = menu.val;
    //     // check the details of the user's account
    //     const accountNo = menu.session.get('accountNumber').then((accountNumber) => accountNumber);
    //     const amount = menu.session.get('amount').then((amountX) => amountX);
    //     // send withdrawal request to the server
    //     const body = {
    //       accountNo, amount
    //     };
    //     if (decision === '1') {
    //       menu.con(`Thank you for using our services\n
    //       98. Main Menu
    //       99. Exit`);
    //     }

    //     if (decision === '2') {
    //       menu.end('Thank you for using our services');
    //     }
    //   },
    // });

    const page = await menu.run(args);
    console.log('this is page ', page);
    return page;
  }
}

export default WalletMenuBuilderHelper;
