const AWS = require('aws-sdk');

const Nexmo = require('nexmo');
const config = require('../config.json');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function checkAuthCode(authCode) {
  console.log('[checkAuthCode] - Code:', authCode);
  const toReturn = { authenticated: false };
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      authCode,
    },
  };

  const items = await dynamoDb.get(params).promise();
  // Check if null or if the auth doesn't exist or if it has false
  console.log('[checkAuthCode] - Retrieved Items', items);
  const { Item } = items;
  if (Item && Item.authenticated) {
    toReturn.authenticated = true;
  }
  toReturn.authenticatedDate = Item.authenticatedDate;
  return toReturn;
}

/**
 * This function given an auth code, it checks if it has been authored.
 * todo: check if the link has been already used
 */
module.exports.checkauth = async (event) => {
  const requestBody = JSON.parse(event.body);
  console.log('[checkAuthCode] - Body', requestBody);
  try {
    const authResult = await checkAuthCode(requestBody.authCode);
    return {
      statusCode: 200,
      body: JSON.stringify({
        authResult,
      }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  } catch (err) {
    console.log('Err', err);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  }
};
