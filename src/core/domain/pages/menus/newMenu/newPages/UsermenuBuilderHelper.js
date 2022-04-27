/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
/* eslint-disable no-undef */
import UssdMenu from 'ussd-menu-builder';
import MainServer from '../../../../../data/APICALLS/mainServer';
import RegisterPage from '../../../registerpage';
import Ussd1 from '../../../ussd1';

class UserMenuBuilderHelper {
// static sessions = {};

  static async menus(args, menu) {
    // Define menu states
    menu.state('Register', {
      run: () => {
        // use menu.con() to send response without terminating session
        menu.con(RegisterPage.page());
      },
      // next object links to next state based on user input
      next: {
        1: 'Accept_Registration',
        98: '__start__',
        99: 'Exit'
      }
    });
    // }

    menu.state('Accept_Registration', {
      run: () => {
        menu.con('Enter your email address');
      },
      next: {
        '*\\d+': 'accept_registration',
      }
    });

    menu.state('accept_registration', {
      run: async () => {
        const email = await menu.val;
        const response = await MainServer.register({ phoneNumber: args.phoneNumber, email });
        await menu.end(`${response}`);
      },
    });

    const page = await menu.run(args);
    console.log('this is page ', page);
    return page;
  }
}

export default UserMenuBuilderHelper;
