const AWS = require('aws-sdk');

const Nexmo = require('nexmo');
const queryString = require('query-string');
const config = require('../config.json');

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * This function sends a callback after the authentication process
 * @param {} to
 * @param {*} from
 */
async function sendSmsCallback(to, from) {
  const nexmo = new Nexmo({
    apiKey: config.NEXMO_API_KEY,
    apiSecret: config.NEXMO_API_SECRET,
  });
  const message = {
    content: {
      type: 'text',
      text: 'Please go back to the website login page',
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

async function authenticateCode({ recipient, randomDigits }) {
  console.log('[authenticateCode] - Recipient, randomDigits:', recipient, randomDigits);
  const params = {
    TableName: config.DYNAMODB_TABLE,
    IndexName: config.DYNAMODB_TABLE_INDEX,
    KeyConditionExpression: 'recipient = :recipient and randomDigits = :randomDigits',
    ExpressionAttributeValues: {
      ':recipient': recipient,
      ':randomDigits': Number(randomDigits),
    },
  };
  try {
    const item = await dynamoDb.query(params).promise();
    console.log('[authenticateCode] - Item:', item);
    if (item && item.Items && item.Items.length
      && !item.Items[0].used) {
      // if it has never been used, set booleand authenticated to true.
      // The check code functio will retrieve the code and see if it is authenticated to proceed
      const paramsUpdate = {
        TableName: config.DYNAMODB_TABLE,
        Key: {
          authCode: item.Items[0].authCode,
        },
        UpdateExpression: 'set authenticated = :authenticated, authenticatedDate= :authenticatedDate',

        ExpressionAttributeValues: {
          ':authenticated': true,
          ':authenticatedDate': new Date().toISOString(),
        },
      };

      const updatedItem = await dynamoDb.update(paramsUpdate).promise();
      await sendSmsCallback(recipient, config.NEXMO_SMS_FROM);
      console.log('updatedItem', updatedItem);
      return updatedItem;
    }
    return null;
  } catch (err) {
    console.log('[authenticateCode] - ERR:', err);
    return null;
  }
}
/**
 * This function given an auth code, it checks if it has been authored.
 */
module.exports.inbound = async (event) => {
  const { body } = event;
  console.log('[inbound]', event);
  // msisdn=447749725766&to=447418397993&messageId=1700000245ACDE62&text=Ciao&type=text&keyword=CIAO&message-timestamp=2019-05-30+15%3A36%3A09
  console.log('[inbound] - body', body);
  try {
    /**
     *
        keyword: "CIAO"
        message-timestamp: "2019-05-30 15:36:09"
        messageId: "1700000245ACDE62"
        msisdn: "447749725766"
        text: "Ciao"
        to: "447418397993"
        type: "text"
     */
    const parsed = queryString.parse(body);
    if (!parsed || !parsed.msisdn || !parsed.text) {
      throw new Error('Malformed body');
    }
    await authenticateCode({ recipient: parsed.msisdn, randomDigits: parsed.text });
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  } catch (err) {
    console.log('Err', err);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
    };
  }
};
