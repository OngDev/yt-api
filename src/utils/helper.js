const moment = require('moment');

exports.getDateNowISOLocal = () => {
  try {
    let dateNow = moment().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    dateNow = new Date(dateNow);
    return dateNow;
  } catch (error) {
    throw Error(error.message);
  }
};
