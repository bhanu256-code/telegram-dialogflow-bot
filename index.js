import express from 'express';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Firebase Configuration
const firebaseApp = initializeApp({
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  databaseURL: process.env.FB_DB_URL,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
  appId: process.env.FB_APP_ID
});

const database = getDatabase(firebaseApp);

// Telegram Configuration (FIXED WITH BACKTICKS)
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = https://api.telegram.org/bot${TELEGRAM_TOKEN};

app.use(express.json());

// Webhook Endpoint
app.post('/webhook', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.text) return res.sendStatus(200);

    const response = await generateResponse(message);
    if (response) {
      await fetch(${TELEGRAM_API}/sendMessage, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: message.chat.id,
          text: response
        })
      });
    }
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook Error:', error);
    res.sendStatus(500);
  }
});

// Response Generator
async function generateResponse(message) {
  const command = message.text.toLowerCase();
  
  if (command.includes('photo')) {
    return "📸 Photo uploads coming soon!";
  }
  
  if (command.includes('status') || command.includes('?')) {
    const snapshot = await get(ref(database, 'battery'));
    const data = snapshot.val() || {};
    return 🔋 Battery Status:\n
         + - Temperature: ${data.temperature || 'N/A'}°C\n
         + - Current: ${data.current || 'N/A'}A;
  }

  return null;
}

// Health Check
app.get('/', (req, res) => {
  res.send('✅ EV Monitoring Bot is Active');
});

// Start Server
app.listen(PORT, () => {
  console.log(🚀 Server running on port ${PORT});
  console.log(🔔 Set webhook: ${TELEGRAM_API}/setWebhook?url=[YOUR_RENDER_URL]/webhook);
});
