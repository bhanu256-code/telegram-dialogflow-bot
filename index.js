// ✅ FINAL CLEAN CODE (WITH YOUR TELEGRAM BOT TOKEN) // ✅ USE THIS INSIDE functions/index.js

const functions = require("firebase-functions"); const fetch = require("node-fetch"); const dialogflow = require("dialogflow"); const uuid = require("uuid");

// ✅ Your Telegram Bot Token const TELEGRAM_TOKEN = "8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI"; const TELEGRAM_API = https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage;

// ✅ Your Dialogflow Project ID const projectId = "ev-battery-voice-bot-1f7bc"; // Replace with your Dialogflow Project ID if different const sessionClient = new dialogflow.SessionsClient();

exports.webhook = functions.https.onRequest(async (req, res) => { const message = req.body.message; if (!message || !message.text) { return res.sendStatus(200); }

const chatId = message.chat.id; const userMessage = message.text;

const sessionId = uuid.v4(); const sessionPath = sessionClient.sessionPath(projectId, sessionId);

const request = { session: sessionPath, queryInput: { text: { text: userMessage, languageCode: "en", }, }, };

try { const responses = await sessionClient.detectIntent(request); const result = responses[0].queryResult; const reply = result.fulfillmentText || "Sorry, I didn’t understand that.";

await fetch(TELEGRAM_API, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chat_id: chatId,
    text: reply,
  }),
});

res.sendStatus(200);

} catch (error) { console.error("Dialogflow error:", error); res.sendStatus(500); } });
