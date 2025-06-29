const express = require('express');
const { Telegraf } = require('telegraf');
const { google } = require('googleapis');
const fetch = require('node-fetch');
const gTTS = require('gtts');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const genAI = require('@google/generative-ai'); // ✅ Gemini

const app = express();

// === CONFIG ===
const BOT_TOKEN = process.env.BOT_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // ✅ Gemini only
const SHEET_ID = process.env.SHEET_ID;
const SHEET_RANGE = process.env.SHEET_RANGE;
const GOOGLE_APPLICATION_CREDENTIALS_JSON = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const PORT = process.env.PORT || 3000;

// === BOT SETUP ===
const bot = new Telegraf(BOT_TOKEN);

// === GEMINI SETUP === ✅
const genAIClient = new genAI.GoogleGenerativeAI(GEMINI_API_KEY);

async function askGemini(query) {
  try {
    const model = genAIClient.getGenerativeModel({ model: 'gemini-pro' }); // ✅ Correct model name
    const result = await model.generateContent(query);
    const response = result.response;
    return response.text().trim();
  } catch (err) {
    console.error('❌ Gemini API Error:', err);
    return '⚠️ Gemini API error. Try again.';
  }
}

// === GOOGLE SHEETS ===
const googleCredentials = JSON.parse(GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}');
const auth = new google.auth.GoogleAuth({
  credentials: googleCredentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
const sheets = google.sheets({ version: 'v4', auth });

async function logToSheet(user, input, reply) {
  try {
    const now = new Date();
    const values = [[now.toLocaleString(), user, input, reply]];
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_RANGE}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values }
    });
  } catch (err) {
    console.error('❌ Error logging to Google Sheets:', err);
  }
}

// === VOICE DIRECTORY ===
const voiceDir = path.join(__dirname, 'voice');
if (!fs.existsSync(voiceDir)) fs.mkdirSync(voiceDir);

// === TEXT HANDLER ===
bot.on('text', async (ctx) => {
  try {
    const text = ctx.message.text;
    const user = ctx.from.username || ctx.from.first_name;

    const response = await askGemini(text); // ✅ Corrected call
    await ctx.reply(response);
    await logToSheet(user, text, response);
  } catch (err) {
    console.error(err);
    await ctx.reply('❌ Error handling your text.');
  }
});

// === VOICE HANDLER ===
bot.on('voice', async (ctx) => {
  try {
    const fileId = ctx.message.voice.file_id;
    const url = await ctx.telegram.getFileLink(fileId);
    const user = ctx.from.username || ctx.from.first_name;

    const fallbackQuery = 'Battery status';
    const response = await askGemini(fallbackQuery); // ✅ Corrected call

    const filename = `voice_${Date.now()}`;
    const mp3Path = path.join(voiceDir, `${filename}.mp3`);
    const oggPath = path.join(voiceDir, `${filename}.ogg`);

    const gtts = new gTTS(response, 'en');
    await new Promise((resolve, reject) =>
      gtts.save(mp3Path, err => (err ? reject(err) : resolve()))
    );

    await new Promise((resolve, reject) => {
      ffmpeg(mp3Path)
        .outputOptions(['-acodec libopus'])
        .save(oggPath)
        .on('end', resolve)
        .on('error', reject);
    });

    await ctx.replyWithVoice({ source: oggPath });
    await logToSheet(user, '[Voice Input]', response);

    if (fs.existsSync(mp3Path)) fs.unlinkSync(mp3Path);
    if (fs.existsSync(oggPath)) fs.unlinkSync(oggPath);
  } catch (err) {
    console.error(err);
    await ctx.reply('❌ Error handling your voice.');
  }
});

// === HEALTH CHECK ===
app.get('/', (req, res) => res.send('✅ EV Protector Bot (Gemini version) is running.'));

// === WEBHOOK ENDPOINT ===
app.use(express.json());
app.post('/webhook', (req, res) => {
  bot.handleUpdate(req.body, res);
});

// === SET WEBHOOK & START SERVER ===
bot.telegram.setWebhook(WEBHOOK_URL)
  .then(() => console.log('✅ Webhook successfully set!'))
  .catch(err => console.error('❌ Webhook setup failed:', err));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
