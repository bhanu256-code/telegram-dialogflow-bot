import fetch from 'node-fetch'; // Only if you're using ESM (Node >= v18)

const TELEGRAM_TOKEN = 'your_bot_token_here'; // Replace with real Bot Token
const TELEGRAM_API = https://api.telegram.org/bot${TELEGRAM_TOKEN};

// Example function to send a message
async function sendMessage(chatId, message) {
  const url = ${TELEGRAM_API}/sendMessage;

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
    }),
  });
}

// Example: Receiving and replying (basic polling loop)
const http = await import('http');

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is alive');
}).listen(process.env.PORT || 3000);

// Example auto message to test
const chatId = 'your_chat_id_here'; // Replace with your own Telegram ID
sendMessage(chatId, 'Bot started ✅');
