const express = require('express');
const { Telegraf } = require('telegraf');
const { GoogleAuth } = require('google-auth-library');
const app = express();

// === CONFIGURATION ===
const BOT_TOKEN = '8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI';
const DIALOGFLOW_PROJECT_ID = 'your-dialogflow-project-id'; // Replace this!
const CHAT_ID = '6283627737';
// ====================

const bot = new Telegraf(BOT_TOKEN);
app.use(express.json());

// Handle Telegram messages
bot.on('text', async (ctx) => {
  try {
    if (ctx.chat.id.toString() === CHAT_ID) {
      const response = await callDialogflow(
        DIALOGFLOW_PROJECT_ID,
        ctx.chat.id.toString(),
        ctx.message.text
      );
      await ctx.reply(response);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    await ctx.reply('Service temporarily unavailable');
  }
});

// Fixed Dialogflow URL with proper template literals
async function callDialogflow(projectId, sessionId, query) {
  const auth = new GoogleAuth({
    keyFile: 'service-account.json',
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });

  const client = await auth.getClient();
  const url = https://dialogflow.googleapis.com/v2/projects/${projectId}/agent/sessions/${sessionId}:detectIntent;

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

// Webhook endpoint
app.post('/webhook', (req, res) => {
  bot.handleUpdate(req.body, res);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(✅ Bot active on port ${PORT}));
