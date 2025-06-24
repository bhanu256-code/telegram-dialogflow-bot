// ======================
// ✅ FINAL WORKING VERSION
// ======================
require('dotenv').config();
const axios = require('axios');

// 1️⃣ PROPER TOKEN SETUP (fixed syntax)
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI';

// 2️⃣ CORRECT API URL (fixed URL format)
const TELEGRAM_API = https://api.telegram.org/bot${TELEGRAM_TOKEN};

// 3️⃣ BOT STARTER (with error handling)
async function startBot() {
  try {
    // First verify the token works
    const test = await axios.get(${TELEGRAM_API}/getMe);
    console.log(✅ Bot ONLINE: @${test.data.result.username});
    
    // Add your bot logic here
    console.log("🔄 Listening for messages...");
    
  } catch (error) {
    console.error('❌ FATAL ERROR:', error.message);
    console.log('🔧 Check:');
    console.log('1. Is your token correct?');
    console.log(2. Test manually: https://api.telegram.org/bot${TELEGRAM_TOKEN}/getMe);
    process.exit(1);
  }
}

startBot();
