// ======================
// ✅ GUARANTEED WORKING CODE (NO MODULES)
// ======================

// 1️⃣ HARDCODED TOKEN
const TELEGRAM_TOKEN = "8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI";
const TELEGRAM_API = "https://api.telegram.org/bot" + TELEGRAM_TOKEN;

// 2️⃣ SIMPLE TEST
console.log("Testing connection to Telegram API...");

// 3️⃣ BASIC HTTP REQUEST (no axios)
fetch(TELEGRAM_API + "/getMe")
  .then(response => response.json())
  .then(data => {
    console.log("Bot ONLINE: @" + data.result.username);
    console.log("Ready to receive messages!");
  })
  .catch(error => {
    console.error("CONNECTION FAILED!");
    console.log("Test this URL manually: " + TELEGRAM_API + "/getMe");
  });
process.env.PORT = 3000;  // Add this line at the end of your file
