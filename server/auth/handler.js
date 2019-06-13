const AWS = require('aws-sdk');

const Nexmo = require('nexmo');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const config = require('../config.json');
const { getNumberFromCountryCode } = require('../util');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();


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

function putUrlMappingItem(authCode, recipient, randomDigits, country) {
  console.log('[putUrlMappingItem]', authCode, recipient);
  const item = {
    authCode,
    recipient,
    authenticated: false,
    randomDigits,
    country,
  };
  const itemToSave = {
    TableName: config.DYNAMODB_TABLE,
    Item: item,
  };
  console.log('[putUrlMappingItem] - itemToSave', itemToSave);
  return dynamoDb.put(itemToSave).promise()
    .then(() => itemToSave);
}

/**
* This function handle the SMS send procedure using Nexmo library
* @param {*} to
* @param {*} message
*/
function sendSMS(to, from, url) {
  console.log('[sendSMS]', to, from, url);
  const nexmo = new Nexmo({
    apiKey: config.NEXMO_API_KEY,
    apiSecret: config.NEXMO_API_SECRET,
  });
  const message = {
    content: {
      type: 'text',
      text: `Click here to authenticate: ${url}`,
    },
  };
  return new Promise((resolve, reject) => {
    nexmo.channel.send(
      { type: 'sms', number: to },
      { type: 'sms', number: from },
      message,
      (err, data) => {
        if (err) {
          console.log('[sendSMS] - err', err);
          reject(err);
        }
        console.log('[sendSMS] - Sms Sent', data);
        // data.message_uuid
        resolve(data);
      },
      { useBasicAuth: true },
    );
  });
}

/**
 * This function creates a random unique string. It saves the item in DynamoDB.
 * Finally sends the SMS to the phone number with the auth link
 */
module.exports.auth = async (event) => {
  const uniqueCode = generateRandomString();
  const randomDigits = generateRandomDigits();
  const bucketName = `http://${config.BUCKET}.s3-website.${config.REGION}.amazonaws.com/login?auth=${uniqueCode}&code=${randomDigits}`;
  try {
    const requestBody = JSON.parse(event.body);
    const { country } = parsePhoneNumberFromString(`+${requestBody.recipient}`);
    await putUrlMappingItem(uniqueCode, requestBody.recipient, randomDigits, country);
    await sendSMS(requestBody.recipient, getNumberFromCountryCode(country), bucketName);
    return {
      statusCode: 200,
      body: JSON.stringify({}),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  } catch (err) {
    console.log('[Error in Auth handler]', err);
    return {
      statusCode: 501,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  }
};
