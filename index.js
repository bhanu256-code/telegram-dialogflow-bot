// ======================
// ✅ GUARANTEED WORKING CODE
// ======================
require('dotenv').config();
const axios = require('axios');

// 1️⃣ HARDCODED TOKEN (no variables)
const TELEGRAM_API = "https://api.telegram.org/bot8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI";

// 2️⃣ SIMPLE TEST (no emoji syntax errors)
console.log("Testing connection to: " + TELEGRAM_API);

axios.get(TELEGRAM_API + "/getMe")
  .then(response => {
    console.log("✅ Bot ONLINE: @" + response.data.result.username);
    console.log("Ready to receive messages!");
  })
  .catch(error => {
    console.error("CONNECTION FAILED!");
    console.log("Manual test URL: " + TELEGRAM_API + "/getMe");
    process.exit(1);
  });
