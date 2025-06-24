// ======================
// 🚀 WORKING BOT STARTER
// ======================
require('dotenv').config();

// 1️⃣ PROPER TOKEN SETUP
const TELEGRAM_TOKEN = '8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI'; 

// 2️⃣ CORRECT API URL (FIXED)
const TELEGRAM_API = https://api.telegram.org/bot${TELEGRAM_TOKEN};

// 3️⃣ START BOT (WITH ERROR CHECK)
console.log("🔍 Testing bot connection...");
require('axios').get(${TELEGRAM_API}/getMe)
  .then(response => {
    console.log(✅ Bot ONLINE: @${response.data.result.username});
    console.log("🟢 Add your bot logic here!");
  })
  .catch(error => {
    console.error('❌ CONNECTION FAILED!');
    console.log("🔧 Fix these:");
    console.log("1. Token must be EXACTLY: '8105233862:AAFWbwNf...'");
    console.log(2. Test manually: ${TELEGRAM_API}/getMe);
    process.exit(1);
  });
