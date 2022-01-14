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
    4. Raffle Draw. 
    5. Legendary Lotto.
    6. Back.
    98.Main Menu.
    99.Exit.`;
  }

  /**
   * @method
   * @returns String
   */
  static gameschedules() {
    return `1. Monday Games.
    2. Tuesday Games.
    3. Wednesday Games.
    4. Thursay Games.
    5. Friday Games.
    6. Saturday Games.
    7. Sunday  Games.
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
    return `1. Perm1.
    2. Perm2.
    3. Perm3.
    4. Perm4.
    5. Perm5.
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
  static getGameNameForInput(Input) {
    console.log(Input);
    let name = '';
    switch (Input) {
      case '1':
        name = 'Perm1';
        break;
      case '2':
        name = 'Perm2';
        break;
      case 3:
        name = 'Perm3';
        break;
      case 4:
        name = 'Perm4';
        break;
      case 5:
        name = 'Perm5';
        break;
      case 6:
        name = 'FDN';
        break;
      case 7:
        name = '1-Against All';
        break;
      case 8:
        name = 'Banker';
        break;
      case 9:
        name = 'NAP1';
        break;
      case 12:
        name = 'NAP2';
        break;
      case 13:
        name = 'NAP3';
        break;
      case 14:
        name = 'NAP4';
        break;
      case 15:
        name = 'NAP5';
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
    let inst = '';
    switch (Input) {
      case 1:
        inst = 'Perm1';
        break;
      case 2:
        inst = 'Perm2';
        break;
      case 3:
        inst = 'Perm3';
        break;
      case 4:
        inst = 'Perm4';
        break;
      case 5:
        inst = 'Perm5';
        break;
      case 6:
        inst = 'FDN';
        break;
      case 7:
        inst = '1-Against All';
        break;
      case 8:
        inst = 'Banker';
        break;
      case 9:
        inst = 'NAP1';
        break;
      case 12:
        inst = 'NAP2';
        break;
      case 13:
        inst = 'NAP3';
        break;
      case 14:
        inst = 'NAP4';
        break;
      case 15:
        inst = 'NAP5';
        break;
      default:
        inst = 'Invalid Input';
        break;
    }
    return inst;
  }
}

export default GamePages;
