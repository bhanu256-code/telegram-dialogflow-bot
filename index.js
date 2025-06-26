const express = require('express');
const { Telegraf } = require('telegraf');
const { GoogleAuth } = require('google-auth-library');
const fetch = require('node-fetch');
const gTTS = require('gtts');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const app = express();

// 💬 Config
const BOT_TOKEN = '8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI';
const DIALOGFLOW_PROJECT_ID = 'evbatterymonitor-4c65d';
const PORT = process.env.PORT || 3000;

// 🤖 Telegram Bot
const bot = new Telegraf(BOT_TOKEN);
bot.launch();

// ✅ Create voice folder if not exists
const voiceDir = path.join(__dirname, 'voice');
if (!fs.existsSync(voiceDir)) {
  fs.mkdirSync(voiceDir);
}

// 🧠 Dialogflow Handler
async function askDialogflow(projectId, sessionId, query) {
  const auth = new GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });

  const client = await auth.getClient();
  const url = `https://dialogflow.googleapis.com/v2/projects/${projectId}/agent/sessions/${sessionId}:detectIntent`;

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
    const text = ctx.message.text;

    const response = await askDialogflow(
      DIALOGFLOW_PROJECT_ID,
      ctx.chat.id.toString(),
      text
    );

    // Save response as audio
    const filename = `voice_${Date.now()}`;
    const mp3Path = `voice/${filename}.mp3`;
    const oggPath = `voice/${filename}.ogg`;

    const gtts = new gTTS(response, 'en');
    await new Promise((resolve, reject) => {
      gtts.save(mp3Path, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Convert mp3 to ogg
    await new Promise((resolve, reject) => {
      ffmpeg(mp3Path)
        .outputOptions(['-acodec libopus'])
        .save(oggPath)
        .on('end', resolve)
        .on('error', reject);
    });

    // Send voice back
    await ctx.replyWithVoice({ source: oggPath });

    // Cleanup
    fs.unlinkSync(mp3Path);
    fs.unlinkSync(oggPath);

  } catch (error) {
    console.error(error);
    await ctx.reply("❌ Error processing your voice request.");
  }
});

// 🌐 Webhook for Render
app.use(express.json());
app.post('/webhook', (req, res) => {
  bot.handleUpdate(req.body, res);
});

// 🚀 Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
