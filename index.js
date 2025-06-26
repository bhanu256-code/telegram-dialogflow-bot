const axios = require('axios'); // <-- Add this line
const express = require('express');
const { Telegraf } = require('telegraf');
const { GoogleAuth } = require('google-auth-library');

const app = express();

// 💬 Config
const BOT_TOKEN = '8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI';
const DIALOGFLOW_PROJECT_ID = 'evbatterymonitor-4c65d';
const PORT = process.env.PORT || 3000;

// 🤖 Telegram Bot
const bot = new Telegraf(BOT_TOKEN);
// 🧠 Dialogflow Handler
async function askDialogflow(projectId, sessionId, query) {
  const auth = new GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });

  const client = await auth.getClient();
  const url =`https://dialogflow.googleapis.com/v2/projects/${projectId}/agent/sessions/${sessionId}:detectIntent`;

  const { data } = await client.request({
    url,
    method: 'POST',
    data: {
      queryInput: {
        text: {
          text: query,
          languageCode: 'en-US'
        }
      }
    }
  });

  return data.queryResult.fulfillmentText;
}

// 📩 Handle messages from Telegram
bot.on('text', async (ctx) => {
  try {
    const response = await askDialogflow(
      DIALOGFLOW_PROJECT_ID,
      ctx.chat.id.toString(),
      ctx.message.text
    );

    await ctx.reply(response); // Send Dialogflow reply to user

    // ✅ Google Sheets Logging (Dummy Values for now)
    const logData = {
      temperature: 37.5,
      current: 1.6
    };

    axios.post('https://script.google.com/macros/s/AKfycbzEfb6jkBzKOtvKhJr2jun5QwX5Fxph-3wAWLv1wbHTlSWPp5xuHq7GpseIip1kb0kH/exec', logData)
      .then(() => {
        console.log("✅ Data sent to Google Sheets:", logData);
      })
      .catch((err) => {
        console.error("❌ Error sending to Google Sheets:", err.message);
      });

  } catch (error) {
    console.error(error);
    await ctx.reply("❌ Error processing your request.");
  }
});

// 🌐 Webhook for Render
app.use(express.json());
app.post('/webhook', (req, res) => {
  bot.handleUpdate(req.body, res);
});

// 🚀 Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
