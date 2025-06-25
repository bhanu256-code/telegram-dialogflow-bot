const TELEGRAM_TOKEN = "8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI";
const TELEGRAM_API = "https://api.telegram.org/bot" + TELEGRAM_TOKEN;

// Web server for Render
require('http').createServer((req, res) => {
  res.end('Bot is running');
}).listen(3000);

async function checkMessages() {
  try {
    const response = await fetch(TELEGRAM_API + "/getUpdates");
    const data = await response.json();
    
    if (data.result?.length > 0) {
      const msg = data.result[0].message;
      console.log("Received:", msg.text);
      
      // Add this reply logic:
      await fetch(TELEGRAM_API + "/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: msg.chat.id,
          text: "Hello! You said: " + msg.text
        })
      });
    }
  } catch (error) {
    console.log("Error:", error.message);
  }
  setTimeout(checkMessages, 3000);
}

console.log("🤖 Bot started successfully");
checkMessages();
