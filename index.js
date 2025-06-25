// 1. HARDCODED TOKEN
const TELEGRAM_TOKEN = "8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI";
const TELEGRAM_API = "https://api.telegram.org/bot" + TELEGRAM_TOKEN;

// 2. SIMPLE STARTUP LOG
console.log("Bot is alive. Using polling mode.");
console.log("Testing connection to Telegram API...");

// 3. BASIC HTTP REQUEST USING fetch
fetch(TELEGRAM_API + "/getMe")
  .then(response => response.json())
  .then(data => {
    console.log("Bot is online: @" + data.result.username);
    console.log("Ready to receive messages.");
  })
  .catch(error => {
    console.error("Connection to Telegram failed.");
    console.log("You can manually test this URL: " + TELEGRAM_API + "/getMe");
  });

// 4. OPTIONAL: Fake port to avoid Render scan issues
process.env.PORT = 3000;
