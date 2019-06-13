const config = require('../config.json');

const getNumberFromCountryCode = (countryCode) => {
  let toReturn = config.FROM.GB;
  console.log('[getNumberFromCountryCode]', countryCode);
  switch (countryCode) {
    case 'US':
      toReturn = config.FROM.US;
      break;
    case 'FR':
      toReturn = config.FROM.FR;
      break;
    default:
  }
  return toReturn;
};

module.exports = {
  getNumberFromCountryCode,
};
