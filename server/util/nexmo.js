const OpenTok = require('opentok');
const Nexmo = require('nexmo');
const config = require('../config.json');

const defaultExpiryTime = (7 * 24 * 60 * 60); // in one week

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

function createTokBoxSession() {
  const opentok = new OpenTok(config.TOKBOX_API_KEY, config.TOKBOX_API_SECRET);
  return new Promise((resolve, reject) => opentok.createSession((err, session) => {
    if (err) {
      reject(err);
    }
    console.log('[createTokBoxSession]', session);
    resolve(session.sessionId);
  }));
}

function createTokBoxToken(sessionId, expireTime = defaultExpiryTime, role = 'publisher') {
  const options = {
    role,
    expireTime: (new Date().getTime() / 1000) + expireTime,
  };
  const opentok = new OpenTok(config.TOKBOX_API_KEY, config.TOKBOX_API_SECRET);
  return opentok.generateToken(sessionId, options);
}

module.exports = {
  sendSMS,
  createTokBoxSession,
  createTokBoxToken,
};
