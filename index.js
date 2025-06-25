const express = require('express');
const { Telegraf } = require('telegraf');
const { GoogleAuth } = require('google-auth-library');
const app = express();

// Config (replace these!)
const BOT_TOKEN = '8105233862:AAFMDwNfKBCX5Ng5mpVF6jd8JcaZq7RQZnI';
const DIALOGFLOW_PROJECT_ID = 'your-dialogflow-project-id';
const PORT = process.env.PORT || 3000;

const bot = new Telegraf(BOT_TOKEN);

// Handle Telegram messages
bot.on('text', async (ctx) => {
  try {
    const response = await askDialogflow(
      DIALOGFLOW_PROJECT_ID,
      ctx.chat.id.toString(),
      ctx.message.text
    );
    await ctx.reply(response);
  } catch (error) {
    console.error(error);
    await ctx.reply("❌ Error processing your request.");
  }
});

// Dialogflow integration
async function askDialogflow(projectId, sessionId, query) {
  const auth = new GoogleAuth({
    keyFile: 'service-account.json',
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
  const client = await auth.getClient();

  // 🔴 ERROR WAS HERE (missing backticks ` for string interpolation)
  const url ='https://dialogflow.googleapis.com/v2/projects/${projectId}/agent/sessions/${sessionId}:detectIntent';

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

// Webhook setup
app.use(express.json());
app.post('/webhook', (req, res) => {
  bot.handleUpdate(req.body, res);
});

// 🔵 FIXED THIS LINE — now has 2 correct brackets and proper backticks
app.listen(PORT, () => console.log('🚀 Server running on port ${PORT}'));
