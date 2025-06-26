const express = require("express");
const { Telegraf } = require("telegraf");
const { GPT } = require("google-auth-library"); // Optional if you're using Dialogflow directly
const axios = require("axios");
const gTTS = require("gtts");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 10000;
const bot = new Telegraf(process.env.BOT_TOKEN);

// Route for Render uptime check
app.get("/", (req, res) => {
  res.send("🚀 EV Bot is Live!");
});

// Main message handler
bot.on("text", async (ctx) => {
  try {
    const userMessage = ctx.message.text;

    // Simple text echo OR connect with Dialogflow here
    const botReply = You said: "${userMessage}";

    // Send voice reply
    const gtts = new gTTS(botReply, 'en');
    const filePath = voice_${Date.now()}.mp3;

    gtts.save(filePath, async function (err) {
      if (err) {
        console.error("❌ Error saving audio:", err);
        ctx.reply("Sorry, couldn't create voice.");
      } else {
        await ctx.replyWithVoice({ source: filePath });
      }
    });

  } catch (error) {
    console.error("⚠ Error:", error);
    ctx.reply("Something went wrong!");
  }
});

// Start Express server
app.listen(PORT, () => {
  console.log(🚀 Server running on port ${PORT});
});

// Start Telegram bot
bot.launch();
