const AWS = require('aws-sdk');


const { parsePhoneNumberFromString } = require('libphonenumber-js');
const config = require('../config.json');
const { getNumberFromCountryCode, generateRandomDigits, generateRandomString } = require('../util');
const { putUrlMappingItem } = require('../util/dynamodb');
const { sendSMS, createTokBoxSession, createTokBoxToken } = require('../util/nexmo');

AWS.config.setPromisesDependency(require('bluebird'));

/**
 * This function creates a random unique string. It saves the item in DynamoDB.
 * Finally sends the SMS to the phone number with the auth link
 */
module.exports.handler = async (event) => {
  const uniqueCode = generateRandomString();
  const randomDigits = generateRandomDigits();
  // todo put name in dynamic mode from serverless file
  const bucketName = `http://d3dqye79o8tcoo.cloudfront.net/login?auth=${uniqueCode}&code=${randomDigits}`;
  try {
    const requestBody = JSON.parse(event.body);
    const { country } = parsePhoneNumberFromString(`+${requestBody.recipient}`);
    const sessionId = await createTokBoxSession();
    const adminToken = await createTokBoxToken(sessionId);
    const customerToken = await createTokBoxToken(sessionId);
    const opentok = {
      apiKey: config.TOKBOX_API_KEY, sessionId, adminToken, customerToken,
    };
    await putUrlMappingItem(uniqueCode, requestBody.recipient, randomDigits, country, opentok);
    await sendSMS(requestBody.recipient, getNumberFromCountryCode(country), bucketName);
    return {
      statusCode: 200,
      body: JSON.stringify({
        opentok,
      }),
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
