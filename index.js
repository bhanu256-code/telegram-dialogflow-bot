require('dotenv').config(); // Load environment variables (if using .env)
const axios = require('axios'); // Make sure to install with: npm install axios

// Telegram Bot Token (from @BotFather)
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI';
const TELEGRAM_API_URL = https://api.telegram.org/bot${TELEGRAM_TOKEN};

// Initialize bot
async function startBot() {
  try {
    // Test the token first
    const testResponse = await axios.get(${TELEGRAM_API_URL}/getMe);
    console.log('Bot connected successfully:', testResponse.data.result.username);

    // Your bot logic here (example: reply to messages)
    console.log('Bot is running...');
    
  } catch (error) {
    console.error('❌ Bot failed to start:', error.message);
    if (error.response) {
      console.error('Telegram API error:', error.response.data);
    }
    process.exit(1); // Exit if can't connect
  }
}

// Start the bot
startBot();
