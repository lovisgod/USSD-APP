/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
class GamePages {
  /**
   * @method
   * @returns String
   */
  static firstPage() {
    return `1.Play Games.
    2.Play Booking Code.
    98.Main Menu.
    99.Exit.`;
  }

  /**
   * @method
   * @returns String
   */
  static checkGame() {
    return `1.Enter your booking code.
    98.Main Menu.
    99.Exit.`;
  }

  /**
   * @method
   * @returns String
   */
  static playGameMenu() {
    return `1.Lottery Game.
    2.Jackpot Game.
    98.Main Menu.
    99.Exit.`;
  }

  /**
   * @method
   * @returns String
   */
  static lotteryGameMenu() {
    return `1. Lotto Indoor Game.
    2. Lotto Ghana Game.
    3. Salary 4Life.
    4. Legendary Lotto.
    5. Back.
    98.Main Menu.
    99.Exit.`;
  }

  /**
   * @method
   * @returns String
   */
  static gameschedules() {
    return `1. Sunday Games.
    2. Monday Games.
    3. Tuesday Games.
    4. Wednesday Games.
    5. Thursday Games.
    6. Friday Games.
    7. Saturday  Games.
    8. Back.
    98.Main Menu.
    99.Exit.`;
  }

  /**
   * @method
   * @returns String
   */
  static loadedGamesforDailyGames() {
    return `1. Name1.
    2. Name2.
    3. Name3.
    8. Back.
    98.Main Menu.
    99.Exit.`;
  }

  /**
   * @method
   * @returns String
   */
  static lottoGameTypes() {
    return `1. PERM-1.
    2. PERM-2.
    3. PERM-3.
    4. PERM-4.
    5. PERM-5.
    6. FDN.
    7. 1-Against All.
    8. Banker.
    9. NAP1.
    10. NEXT
    11. BACK.
    98.Main Menu.
    99.Exit.`;
  }

  /**
   * @method
   * @returns String
   */
  static lottoGameTypes2() {
    return `12. NAP2.
    13. NAP3.
    14. NAP4.
    15. NAP5.
    16. BACK.
    98.Main Menu.
    99.Exit.`;
  }

  /**
   * @method
   * @returns String
   */
  static raffleDrawMenu() {
    return `1. 6m.
    2. 5m.
    3. 4m.
    4. 3m.
    5. 2m.
    6. back
    98.Main Menu.
    99.Exit.`;
  }

  /**
   * @method
   * @returns String
   */
  static getBoosters() {
    return `1.Default
    2.Mega
    3.Max
    4.Straight
    5.Turning
    6.Over-under
    7.back
    98.Main Menu.
    99.Exit.`;
  }

  /**
   * @method
   * @returns String
   */
  static getReultTypes() {
    return `1.Winning
    2.Machine
    3.Double-chance
    4.1-leg
    5.Turning
    6.Recovery
    7.back
    98.Main Menu.
    99.Exit.`;
  }

  /**
   * @method
   * @returns String
   */
  static getGameNameForInput(Input) {
    console.log(Input);
    let name = '';
    switch (Input) {
      case '1':
        name = 'perm-1';
        break;
      case '2':
        name = 'perm-2';
        break;
      case '3':
        name = 'perm-3';
        break;
      case '4':
        name = 'perm-4';
        break;
      case '5':
        name = 'perm-5';
        break;
      case '6':
        name = 'FDN';
        break;
      case '7':
        name = '1-Against All';
        break;
      case '8':
        name = 'Banker';
        break;
      case '9':
        name = 'nap-1';
        break;
      case '12':
        name = 'nap-2';
        break;
      case '13':
        name = 'nap-3';
        break;
      case '14':
        name = 'nap-4';
        break;
      case '15':
        name = 'nap-5';
        break;
      default:
        name = 'Invalid Input';
        break;
    }
    return name;
  }

  /**
   * @method
   * @returns String
   */
  static getGameInstructionForInput(Input) {
    console.log('got here');
    console.log(Input);
    let inst = '';
    switch (Input) {
      case '1':
        inst = 'Perm1';
        break;
      case '2':
        inst = 'Perm2';
        break;
      case '3':
        inst = 'Perm3';
        break;
      case '4':
        inst = 'Perm4';
        break;
      case '5':
        inst = 'Perm5';
        break;
      case '6':
        inst = 'FDN';
        break;
      case '7':
        inst = '1-Against All';
        break;
      case '8':
        inst = 'Banker';
        break;
      case '9':
        inst = 'NAP1';
        break;
      case '12':
        inst = 'NAP2';
        break;
      case '13':
        inst = 'NAP3';
        break;
      case '14':
        inst = 'NAP4';
        break;
      case '15':
        inst = 'NAP5';
        break;
      default:
        inst = 'Invalid Input';
        break;
    }
    return inst;
  }

  /**
   * @method
   * @returns String
   */
  static getBoosterfromInput(Input) {
    console.log(Input);
    let name = '';
    switch (Input) {
      case '1':
        name = 'Default';
        break;
      case '2':
        name = 'Mega';
        break;
      case '3':
        name = 'Max';
        break;
      case '4':
        name = 'Straight';
        break;
      case '5':
        name = 'Turning';
        break;
      case '6':
        name = 'Over-under';
        break;
      default:
        name = 'Invalid Input';
        break;
    }
    return name;
  }

  /**
   * @method
   * @returns String
   */
  static getResultTypefromInput(Input) {
    console.log(Input);
    let name = '';
    switch (Input) {
      case '1':
        name = 'Winning';
        break;
      case '2':
        name = 'Machine';
        break;
      case '3':
        name = 'Double-chance';
        break;
      case '4':
        name = '1-leg';
        break;
      case '5':
        name = 'Turning';
        break;
      case '6':
        name = 'Recovery';
        break;
      default:
        name = 'Invalid Input';
        break;
    }
    return name;
  }
}

export default GamePages;
