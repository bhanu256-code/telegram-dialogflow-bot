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
    // Sanitize output for Telegram
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
