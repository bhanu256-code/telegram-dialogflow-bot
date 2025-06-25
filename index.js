// 🧠 Author: Gorle Bhanu Devi Srinivas (Telegram Bot Developer)
// 🤖 Bot Name: EV Protector (@EVprotector_bot)
// 📅 Date: June 25, 2025
// 🌐 GitHub Repo: https://github.com/bhanu256-code/telegram-dialogflow-bot
// 💡 Credit: Full Telegram bot logic & deployment by Bhanu (⚡Render + Node.js)

// ---------------------------- //
//         IMPORTS             //
// ---------------------------- //
import fetch from 'node-fetch'; // For making HTTP requests
import http from 'http';        // For creating the HTTP server

// ---------------------------- //
//       CONFIGURATION          //
// ---------------------------- //
const TELEGRAM_TOKEN = '8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI';
const TELEGRAM_API = https://api.telegram.org/bot${TELEGRAM_TOKEN};
const ADMIN_CHAT_ID = '6283627737'; // Bhanu's actual chat ID

// ---------------------------- //
//       MESSAGE SENDER        //
// ---------------------------- //
async function sendMessage(chatId, message) {
  const url = ${TELEGRAM_API}/sendMessage;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(Failed to send message to ${chatId}: ${response.status} - ${JSON.stringify(errorData)});
    } else {
      console.log(Message sent successfully to ${chatId}.);
    }
  } catch (error) {
    console.error(Error sending message to ${chatId}:, error);
  }
}

// ---------------------------- //
//      KEEP SERVER ALIVE      //
// ---------------------------- //
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Telegram Bot Service is Running!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  console.log(Server listening on port ${PORT});
  console.log('Telegram Bot is starting up...');

  if (ADMIN_CHAT_ID && ADMIN_CHAT_ID !== 'YOUR_CHAT_ID_HERE') {
    await sendMessage(ADMIN_CHAT_ID, 'Bot service deployed and running! ✅')
      .catch(err => console.error("Error sending startup message:", err));
  } else {
    console.warn("ADMIN_CHAT_ID is not set correctly.");
  }
});

server.on('error', (error) => {
  console.error('HTTP Server Error:', error);
});

// ---------------------------- //
//     FUTURE DEVELOPMENT      //
// ---------------------------- //
// Firebase integration, Webhook handlers, Dialogflow logic, etc.
