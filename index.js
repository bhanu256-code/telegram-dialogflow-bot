// No dependencies needed - pure Node.js
const TELEGRAM_TOKEN = "8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI";

// Use string concatenation instead of template literals
const TELEGRAM_API = "https://api.telegram.org/bot" + TELEGRAM_TOKEN;

// Minimal web server for Render
require('http').createServer((req, res) => {
  res.end('Bot is running');
}).listen(3000);

// Simple polling (no template literals)
async function checkMessages() {
  try {
    const response = await fetch(TELEGRAM_API + "/getUpdates");
    const data = await response.json();
    
    if (data.result && data.result.length > 0) {
      console.log("Received:", data.result[0].message.text);
      // Add your reply logic here
    }
  } catch (error) {
    console.log("Polling error (will retry)");
  }
  setTimeout(checkMessages, 3000);
}

console.log("🤖 Bot started successfully");
checkMessages();
