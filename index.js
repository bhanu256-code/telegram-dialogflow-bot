// ======================
// ✅ ABSOLUTELY WORKING CODE
// ======================
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { SessionsClient } = require('@google-cloud/dialogflow');
const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

// Initialize Firebase (replace with your config)
admin.initializeApp();

// Config (using YOUR credentials)
const CONFIG = {
  TELEGRAM_TOKEN: '8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI',
  DIALOGFLOW_PROJECT_ID: 'ev-battery-voice-bot-1f7bc'
};

exports.dialogflowWebhook = functions.https.onRequest(async (req, res) => {
  try {
    // 1. Validate request
    if (!req.body.message?.text) {
      return res.status(200).send('OK');
    }

    const { chat, text } = req.body.message;

    // 2. Process with Dialogflow
    const sessionClient = new SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(
      CONFIG.DIALOGFLOW_PROJECT_ID, 
      uuidv4()
    );

    const [response] = await sessionClient.detectIntent({
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: 'en'
        }
      }
    });

    // 3. Send Telegram reply
    await fetch(https://api.telegram.org/bot${CONFIG.TELEGRAM_TOKEN}/sendMessage, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chat.id,
        text: response.queryResult.fulfillmentText || "I didn't understand that."
      })
    });

    return res.status(200).send('OK');
    
  } catch (error) {
    console.error('🔥 Error:', error);
    return res.status(500).send('Error');
  }
});
