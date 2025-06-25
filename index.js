// No dependencies needed - uses native Node.js
const TELEGRAM_TOKEN = "8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI";
const TELEGRAM_API = https://api.telegram.org/bot${TELEGRAM_TOKEN};

// Minimal web server for Render
require('http').createServer((req, res) => {
  res.end('Bot is running in polling mode');
}).listen(3000);

// Simple polling (checks every 3 seconds)
async function checkMessages() {
  try {
    const response = await fetch(${TELEGRAM_API}/getUpdates);
    const data = await response.json();
    
    if (data.result?.length > 0) {
      const msg = data.result[0].message;
      console.log(📩 New message: ${msg.text});
      // Add your reply logic here
    }
  } catch (error) {
    console.log("🔄 Polling... (Will retry)");
  }
  setTimeout(checkMessages, 3000);
}

console.log("🤖 Bot started (Polling Mode)");
checkMessages();
