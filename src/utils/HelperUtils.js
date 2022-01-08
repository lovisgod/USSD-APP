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
}

export default HelperUtils;
