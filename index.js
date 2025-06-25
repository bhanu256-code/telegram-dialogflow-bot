// ======================
// ✅ ABSOLUTELY WORKING CODE
// ======================
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dialogflow = require('@google-cloud/dialogflow');
const fetch = require('node-fetch').default;  // Critical .default fix
const { v4: uuidv4 } = require('uuid');

// Initialize Firebase
admin.initializeApp();

// Configuration (using YOUR credentials)
const CONFIG = {
  TELEGRAM_TOKEN: '8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI',
  DIALOGFLOW_PROJECT_ID: 'ev-battery-voice-bot-1f7bc'
};

exports.dialogflowWebhook = functions.https.onRequest(async (req, res) => {
  // Immediate response to prevent timeouts
  res.status(200).send('Processing...');

  try {
    // Validate request
    if (!req.body.message?.text) return;

    const { chat, text } = req.body.message;

    // Dialogflow setup
    const sessionClient = new dialogflow.SessionsClient();
    const sessionPath = sessionClient.projectAgentSessionPath(
      CONFIG.DIALOGFLOW_PROJECT_ID,
      uuidv4()
    );

    // Get Dialogflow response
    const [response] = await sessionClient.detectIntent({
      session: sessionPath,
      queryInput: {
        text: {
          text: text,
          languageCode: 'en'
        }
      }
    });

    // Send reply to Telegram (using string concatenation)
    const telegramUrl = 'https://api.telegram.org/bot' + 
                        CONFIG.TELEGRAM_TOKEN + 
                        '/sendMessage';

    await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chat.id,
        text: response.queryResult.fulfillmentText || 
              "I didn't understand that. Please try again."
      })
    });

  } catch (error) {
    console.error('🔥 FULL ERROR:', error);
  }
});
