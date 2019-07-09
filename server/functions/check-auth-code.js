const { checkAuthCode } = require('../util/dynamodb');


/**
 * This function given an auth code, it checks if it has been authored.
 * todo: check if the link has been already used
 */
module.exports.handler = async (event) => {
  const requestBody = JSON.parse(event.body);
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
