const config = require('../config.json');

const getNumberFromCountryCode = (countryCode) => {
  let toReturn = config.FROM.GB;
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

/**
 * Generate random path
 * @param {*} path
 */
function generateRandomString(path = '') {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const position = Math.floor(Math.random() * characters.length);
  const character = characters.charAt(position);

  if (path.length === 10) {
    return path;
  }

  return generateRandomString(path + character);
}

function generateRandomDigits() {
  return Math.floor(1000 + Math.random() * 9000);
}

module.exports = {
  getNumberFromCountryCode,
  generateRandomDigits,
  generateRandomString,
};
