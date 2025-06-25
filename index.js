import express from 'express';
import fetch from 'node-fetch';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

// Firebase Config
const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  databaseURL: process.env.FB_DB_URL,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
  appId: process.env.FB_APP_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

// Thresholds
const TEMP_THRESHOLD = 2;
const CURRENT_THRESHOLD = 5;

let lastValues = { temp: null, current: null };
let lastMessageTime = 0;
const MESSAGE_COOLDOWN = 30000;

async function sendMessage(message) {
  const now = Date.now();
  if (now - lastMessageTime < MESSAGE_COOLDOWN) return;

  try {
    const response = await fetch(https://api.telegram.org/bot${botToken}/sendMessage, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        disable_notification: true
      })
    });
    lastMessageTime = now;
    console.log('Alert sent:', message);
  } catch (err) {
    console.error('Telegram Error:', err);
  }
}

// Database listeners
onValue(ref(database, 'battery/temperature'), (snapshot) => {
  const temp = snapshot.val();
  if (temp === null || lastValues.temp === null) {
    lastValues.temp = temp;
    return;
  }
  if (Math.abs(temp - lastValues.temp) >= TEMP_THRESHOLD) {
    sendMessage(🌡 Temp Alert: ${lastValues.temp}°C → ${temp}°C);
    lastValues.temp = temp;
  }
});

onValue(ref(database, 'battery/current'), (snapshot) => {
  const current = snapshot.val();
  if (current === null || lastValues.current === null) {
    lastValues.current = current;
    return;
  }
  if (Math.abs(current - lastValues.current) >= CURRENT_THRESHOLD) {
    sendMessage(⚡ Current Alert: ${lastValues.current}A → ${current}A);
    lastValues.current = current;
  }
});

// Server
app.get('/', (req, res) => {
  res.json({ status: 'active', lastValues });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});
