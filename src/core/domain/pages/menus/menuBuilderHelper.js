/* eslint-disable require-jsdoc */
/* eslint-disable no-undef */
import UssdMenu from 'ussd-menu-builder';
import GamePages from '../games';

class MenuBuilderHelper {
  static async gameMenus(args) {
    const menu = new UssdMenu();

    // Define menu states
    menu.startState({
      run: () => {
        // use menu.con() to send response without terminating session
        menu.con(GamePages.firstPage());
      },
      // next object links to next state based on user input
      next: {
        1: 'PlayGames',
        2: 'PlayBookingCode'
      }
    });

    menu.state('PlayGames', {
      run: () => {
        menu.con(GamePages.playGameMenu());
      }
    });

    menu.state('PlayBookingCode', {
      run: () => {
        menu.con('Enter Booking code:');
      },
      next: {
        // using regex to match user input to next state
        '*\\d+': 'PlayBookingCode.code'
      }
    });

    // nesting states
    menu.state('PlayBookingCode.code', {
      run: () => {
        // use menu.val to access user input value
        const code = menu.val;
        menu.end('Booking completed.');
      }
    });

    const page = await menu.run(args);
    return page;
  }
}

export default MenuBuilderHelper;
