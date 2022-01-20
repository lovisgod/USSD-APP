/* eslint-disable valid-jsdoc */
/* eslint-disable require-jsdoc */
class WalletPages {
  /**
     * @method
     * @returns String
     */
  static amountPage() {
    return `WITHDRAWAL\n
    Kindly Enter the Amount you want to Withdraw.`;
  }

  /**
     * @method
     * @returns String
     */
  static accountPage() {
    return 'Please enter you account number.';
  }

  /**
     * @method
     * @returns String
     */
  static bankPage() {
    return `Kindly choose your bank.
    1.GTBank
    2.Access Bank
    3.Diamond Bank
    4.Ecobank
    5.Fidelity Bank
    6.First Bank
    7.Zenith Bank
    98.Main Menu
    99.Exit`;
  }
}

export default WalletPages;
