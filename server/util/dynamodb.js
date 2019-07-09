const AWS = require('aws-sdk');
AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const config = require('../config.json');

function putUrlMappingItem(authCode, recipient, randomDigits, country, opentok) {
  console.log('[putUrlMappingItem]', authCode, recipient);
  const item = {
    authCode,
    recipient,
    authenticated: false,
    randomDigits,
    country,
    opentok,
  };
  const itemToSave = {
    TableName: config.DYNAMODB_TABLE,
    Item: item,
  };
  console.log('[putUrlMappingItem] - itemToSave', itemToSave);
  return dynamoDb.put(itemToSave).promise()
    .then(() => itemToSave);
}

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
    toReturn.opentok = {
      apiKey: Item.opentok.apiKey,
      sessionId: Item.opentok.sessionId,
      token: Item.opentok.customerToken,
    };
  }
  toReturn.authenticatedDate = Item.authenticatedDate;
  return toReturn;
}


module.exports = {
  putUrlMappingItem,
  checkAuthCode,
};
