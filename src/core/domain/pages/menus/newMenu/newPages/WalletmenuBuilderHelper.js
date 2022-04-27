/* eslint-disable require-jsdoc */
/* eslint-disable no-undef */

import WalletPages from '../../../walletpages';
import MainServer from '../../../../../data/APICALLS/mainServer';

class WalletMenuBuilderHelper {
  static async walletMenus(menu, args) {
    // Define menu states

    menu.state('Withdraw', {
      run: () => {
        // use menu.con() to send response without terminating session
        menu.con(WalletPages.amountPage());
      },
      next: {
        '*\\d+': 'wallet.check',
      }
    });
    // // nesting states
    menu.state('wallet.check', {
      run: () => {
        // use menu.val to access user input value
        const amountEntered = menu.val;
        menu.session.set('amount', amountEntered);
        menu.con(`You are about to withdraw ${amountEntered} \n
        Kindly enter 1 to continue or 99 to exit.....`);
      },
      next: {
        1: 'wallet.feedback',
        99: 'Exit'
      }
    });

    // menu.state('wallet.bank', {
    //   run: async () => {
    //     // use menu.val to access user input value
    //     const accountNumber = menu.val;
    //     menu.session.set('accountNumber', accountNumber);
    //     // TODO: get bank list from db and display by pages
    //     const response = await MainServer.getBankLists();
    //     if (response.message === 'success') {
    //       if (response.data.length > 0) {
    //         menu.session.set('bankList', response.data);
    //         let banks = '';
    //         response.data.forEach((element) => {
    //           banks += `${response.data.indexOf(element) + 1}.${element.name}\n`;
    //         });
    //         console.log('banks', banks);
    //         menu.con(`please select a bank
    //         ${banks}
    //          98. Main Menu
    //          99. Exit`);
    //       } else {
    //         menu.con(`No bank available for now.
    //          98. Main Menu
    //          99. Exit`);
    //       }
    //     }
    //     // there will be a state that will check if there is more values to display
    //     // if there is, it will display the next page using this same state

    //     // menu.con(WalletPages.bankPage());
    //   },
    //   next: {
    //     '*\\d+': 'wallet.details',
    //   }
    // });

    // menu.state('wallet.bankCheck', {
    //   run: () => {
    //     // this will be a state that will check if there is more values to display
    //     // if there is, it will display the next page using this same state
    //     menu.con(WalletPages.bankPage());
    //   },
    //   next: {
    //     '*\\d+': 'wallet.account',
    //   }
    // });

    // // // nesting states
    // menu.state('wallet.details', {
    //   run: async () => {
    //     const input = menu.val;
    //     const accountNumber = await menu.session.get('accountNumber');
    //     const amount = await menu.session.get('amount');
    //     const bankSelected = await menu.session.get('bankList');
    //     const bank = bankSelected[input - 1];
    //     // check the details of the user's account
    //     const bankCode = bank.code;
    //     menu.con(`Kindly confirm your details before proceeding.
    //     Account Number: ${accountNumber}
    //     Amount: ${amount}
    //     Bank: ${bank.name}

    //     1. Confirm
    //     2. Edit
    //     98. Main Menu
    //     99. Exit`);
    //   },
    //   next: {
    //     1: 'wallet.feedback',
    //     2: 'wallet.amount'
    //   }
    // });

    // nesting states
    menu.state('wallet.feedback', {
      run: async () => {
        // use menu.val to access user input value
        const input = menu.val;
        // check the details of the user's account
        // const accountNumber = await menu.session.get('accountNumber');
        // const amount = await menu.session.get('amount');
        // const bankSelected = await menu.session.get('bankList');
        // const bank = bankSelected[input - 1];
        // // check the details of the user's account
        // const bankCode = bank.code;
        // send withdrawal request to the server
        const body = {
          amount,
          paymentMethod: 'source'
        };
        const response = await MainServer.createWithdrawal(body);
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
      },
    });

    const page = await menu.run(args);
    console.log('this is page ', page);
    return page;
  }
}

export default WalletMenuBuilderHelper;
