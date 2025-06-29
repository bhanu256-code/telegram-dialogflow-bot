const express = require('express');
const { Telegraf } = require('telegraf');
const { google } = require('googleapis');
const gTTS = require('gtts');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const genAI = require('@google/generative-ai');

const app = express();

// === CONFIG ===
const BOT_TOKEN = process.env.BOT_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SHEET_ID = process.env.SHEET_ID;
const SHEET_RANGE = process.env.SHEET_RANGE;
const GOOGLE_APPLICATION_CREDENTIALS_JSON = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const VOICE_FALLBACK_QUERY = process.env.VOICE_FALLBACK_QUERY || 'Battery status';
const PORT = process.env.PORT || 3000;

// === BOT SETUP ===
const bot = new Telegraf(BOT_TOKEN);

// === GEMINI SETUP ===
const genAIClient = new genAI.GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAIClient.getGenerativeModel({
  model: 'models/gemini-1.5-flash'
});

async function askGemini(query) {
  try {
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: `You are an EV battery expert. Answer concisely: ${query}`
        }]
      }]
    });
    const response = await result.response;
    const rawText = response.text();
    return rawText.replace(/<[^>]*>?/gm, '').trim();
  } catch (err) {
    console.error('❌ Gemini Error:', err.message);
    return '⚠️ Technical issue. Please try again.';
  }
}

// === GOOGLE SHEETS ===
const googleCredentials = JSON.parse(GOOGLE_APPLICATION_CREDENTIALS_JSON || '{}');
if (!googleCredentials.client_email) {
  throw new Error('❌ Invalid Google credentials');
}

const auth = new google.auth.GoogleAuth({
  credentials: googleCredentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});
const sheets = google.sheets({ version: 'v4', auth });

async function logToSheet(user, input, reply) {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_RANGE}!A1`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toISOString(),
          user,
          input.length > 100 ? `${input.substring(0, 100)}...` : input,
          reply.length > 100 ? `${reply.substring(0, 100)}...` : reply
        ]]
      }
    });
  } catch (err) {
    console.error('❌ Sheets Error:', err.message);
  }
}

// === VOICE DIRECTORY ===
const voiceDir = path.join(__dirname, 'voice');
if (!fs.existsSync(voiceDir)) {
  fs.mkdirSync(voiceDir, { recursive: true });
}

// === TEXT HANDLER ===
bot.on('text', async (ctx) => {
  try {
    const text = ctx.message.text;
    const user = ctx.from.username || ctx.from.first_name;

    if (text.length > 2000) {
      return await ctx.reply('❌ Query too long (max 2000 chars)');
    }

    const response = await askGemini(text);
    await ctx.reply(response);
    await logToSheet(user, text, response);
  } catch (err) {
    console.error('❌ Text Handler:', err.message);
    await ctx.reply('🔧 Temporary issue. Try again later.');
  }
});

// === VOICE HANDLER ===
bot.on('voice', async (ctx) => {
  try {
    const user = ctx.from.username || ctx.from.first_name;
    const response = await askGemini(VOICE_FALLBACK_QUERY);

    const filename = `voice_${Date.now()}`;
    const mp3Path = path.join(voiceDir, `${filename}.mp3`);
    const oggPath = path.join(voiceDir, `${filename}.ogg`);

    // Generate voice
    const gtts = new gTTS(response, 'en');
    await new Promise((resolve, reject) => {
      gtts.save(mp3Path, (err) => err ? reject(err) : resolve());
    });

    // Convert to OGG
    await new Promise((resolve, reject) => {
      ffmpeg(mp3Path)
        .outputOptions(['-acodec libopus'])
        .save(oggPath)
        .on('end', resolve)
        .on('error', reject);
    });

    await ctx.replyWithVoice({ source: oggPath });
    await logToSheet(user, '[Voice Message]', response);

    // Cleanup
    [mp3Path, oggPath].forEach(file => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    });
  } catch (err) {
    console.error('❌ Voice Handler:', err.message);
    await ctx.reply('🔧 Voice processing failed. Try text instead.');
  }
});

// === SERVER SETUP ===
app.get('/', (req, res) => res.send('✅ EV Battery Bot (Gemini)'));
app.use(express.json());
app.post('/webhook', (req, res) => {
  bot.handleUpdate(req.body, res);
});

bot.telegram.setWebhook(WEBHOOK_URL)
  .then(() => console.log('✅ Webhook set:', WEBHOOK_URL))
  .catch(err => console.error('❌ Webhook failed:', err.message));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
