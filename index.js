const express = require('express');
const { Telegraf } = require('telegraf');
const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');
const fetch = require('node-fetch');
const gTTS = require('gtts');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

const app = express();

// === Config (Use ENV variables for security) ===
const BOT_TOKEN = process.env.BOT_TOKEN;
const DIALOGFLOW_PROJECT_ID = 'evbatterymonitor-4c65d';
const SHEET_ID = '1zh03pnEhFtgVPatYBKbEzWF97NvofH4WiW8H6WkRdh4';
const SHEET_NAME = 'Ev Battery Log';
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const PORT = process.env.PORT || 3000;

// === Setup Bot ===
const bot = new Telegraf(BOT_TOKEN);

// === Google Auth Setup ===
const googleCredentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}');
if (!googleCredentials.client_email) throw new Error('⚠️ Google Auth JSON is invalid!');

const auth = new google.auth.GoogleAuth({
  credentials: googleCredentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
const sheets = google.sheets({ version: 'v4', auth });

// === Create 'voice' directory if missing ===
const voiceDir = path.join(__dirname, 'voice');
if (!fs.existsSync(voiceDir)) fs.mkdirSync(voiceDir);

// === Dialogflow AI Function ===
async function askDialogflow(query, sessionId) {
  const client = new GoogleAuth({
    credentials: googleCredentials,
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });

  const authClient = await client.getClient();
  const url = `https://dialogflow.googleapis.com/v2/projects/${DIALOGFLOW_PROJECT_ID}/agent/sessions/${sessionId}:detectIntent`;

  const { data } = await authClient.request({
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

// === Google Sheets Logger ===
async function logToSheet(user, input, reply) {
  try {
    const now = new Date();
    const values = [[now.toLocaleString(), user, input, reply]];
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values }
    });
  } catch (err) {
    console.error('❌ Error logging to Google Sheets:', err);
  }
}

// === Handle Text Messages ===
bot.on('text', async (ctx) => {
  try {
    const text = ctx.message.text;
    const user = ctx.from.username || ctx.from.first_name;

    const response = await askDialogflow(text, ctx.chat.id.toString());
    await ctx.reply(response);
    await logToSheet(user, text, response);
  } catch (err) {
    console.error(err);
    await ctx.reply('❌ Error handling your text.');
  }
});

// === Handle Voice Messages ===
bot.on('voice', async (ctx) => {
  try {
    const fileId = ctx.message.voice.file_id;
    const url = await ctx.telegram.getFileLink(fileId);
    const user = ctx.from.username || ctx.from.first_name;

    const query = 'Battery status'; // fallback query for voice
    const response = await askDialogflow(query, ctx.chat.id.toString());

    const filename = `voice_${Date.now()}`;
    const mp3Path = path.join(voiceDir, `${filename}.mp3`);
    const oggPath = path.join(voiceDir, `${filename}.ogg`);

    const gtts = new gTTS(response, 'en');
    await new Promise((resolve, reject) => {
      gtts.save(mp3Path, (err) => (err ? reject(err) : resolve()));
    });

    await new Promise((resolve, reject) => {
      ffmpeg(mp3Path)
        .outputOptions(['-acodec libopus'])
        .save(oggPath)
        .on('end', resolve)
        .on('error', reject);
    });

    await ctx.replyWithVoice({ source: oggPath });
    await logToSheet(user, '[Voice Input]', response);

    // Safer file cleanup
    if (fs.existsSync(mp3Path)) fs.unlinkSync(mp3Path);
    if (fs.existsSync(oggPath)) fs.unlinkSync(oggPath);
  } catch (err) {
    console.error(err);
    await ctx.reply('❌ Error handling your voice.');
  }
});

// === Health Check ===
app.get('/', (req, res) => res.send('✅ EV Protector Bot is running.'));

// === Webhook Endpoint ===
app.use(express.json());
app.post('/webhook', (req, res) => {
  bot.handleUpdate(req.body, res);
});

// === Set Webhook Before Starting Server ===
bot.telegram.setWebhook(WEBHOOK_URL)
  .then(() => console.log('✅ Webhook successfully set!'))
  .catch(err => console.error('❌ Webhook setup failed:', err));

// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
