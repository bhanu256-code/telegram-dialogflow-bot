const functions = require("firebase-functions");
const fetch = require("node-fetch");
const dialogflow = require("dialogflow");
const uuid = require("uuid");

// Config (already set with your credentials)
const TELEGRAM_TOKEN = "8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI";
const TELEGRAM_API = https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage;
const projectId = "ev-battery-voice-bot-1f7bc"; // Your Dialogflow project ID

const sessionClient = new dialogflow.SessionsClient();

exports.webhook = functions.https.onRequest(async (req, res) => {
  const message = req.body.message;
  
  // Ignore non-text messages
  if (!message || !message.text) return res.sendStatus(200);

  const chatId = message.chat.id;
  const sessionId = uuid.v4();
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  try {
    // Get Dialogflow response
    const [response] = await sessionClient.detectIntent({
      session: sessionPath,
      queryInput: {
        text: {
          text: message.text,
          languageCode: "en",
        },
      },
    });

    // Send reply to Telegram
    await fetch(TELEGRAM_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: response.queryResult.fulfillmentText || "I didn't understand that.",
      }),
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
});
