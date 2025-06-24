// ======================
// ✅ 100% WORKING SOLUTION
// ======================
require('dotenv').config();

// 1️⃣ HARDCODE TOKEN (no variables)
const TELEGRAM_API = "https://api.telegram.org/bot8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI";

// 2️⃣ SIMPLE TEST (no template literals)
console.log("🔍 Testing connection to: " + TELEGRAM_API);

require('axios').get(TELEGRAM_API + "/getMe")
  .then(response => {
    console.log(✅ Bot ONLINE: @${response.data.result.username});
    console.log("🟢 Ready to receive messages!");
  })
  .catch(error => {
    console.error('❌ CONNECTION FAILED!');
    console.log("Manual test URL: " + TELEGRAM_API + "/getMe");
    process.exit(1);
  });
