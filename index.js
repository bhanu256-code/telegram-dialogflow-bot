const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
app.use(bodyParser.json());

const token = "8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI";  // your bot token
const chatId = "6283627737"; // your chat ID

const bot = new TelegramBot(token);
bot.sendMessage(chatId, "🚀 EV Protector bot is now LIVE on Render!");

app.post("/webhook", (req, res) => {
  const message = req.body.queryResult?.fulfillmentText || "No message received";
  
  // Send Dialogflow's response to Telegram
  bot.sendMessage(chatId, 🤖 Dialogflow Response: ${message});
  
  res.send({
    fulfillmentText: Telegram message sent: ${message}
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(Server running on port ${PORT});
});
