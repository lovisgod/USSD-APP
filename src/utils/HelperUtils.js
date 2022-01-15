/**
@class
* */
class HelperUtils {
  /**
   * @method
   * @description this method helps to check if a particular token (otp, jwt, et.c) has expired
   * @param {Date} startDate
   * @param {Date} todayDate number of milliseconds after start date
   * @param {integer} duration number of milliseconds after start date
   * @return boolean
   */
  static timeHasElapsed(startDate, todayDate, duration) {
    const startDateMilli = new Date(startDate).getTime(),
      endDateMilli = startDateMilli + duration;
    if (todayDate < endDateMilli) return false;
    return true;
  }

  /**
   * @method
   * @description this method helps to check user input for salary4life game
   * @param {Array} input
   * @param {String} salaryOptionselected
   * @return boolean
   */
  static checksalary4LifeInput(input, salaryOptionselected) {
    if (salaryOptionselected === '6m') {
      if (input.length === 6) return true; return false;
    }
    if (salaryOptionselected === '5m') {
      if (input.length === 5) return true; return false;
    }
    if (salaryOptionselected === '4m') {
      if (input.length === 4) return true; return false;
    }
    if (salaryOptionselected === '3m') {
      if (input.length === 3) return true; return false;
    }
    if (salaryOptionselected === '2m') {
      if (input.length === 2) return true; return false;
    }
  }
}

export default HelperUtils;
