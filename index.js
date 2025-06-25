const TELEGRAM_TOKEN = "8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI";
const PORT = process.env.PORT || 3000;

// Minimal web server (required for Render)
require('express')()
  .use(require('body-parser').json())
  .post('/webhook', (req, res) => {
    console.log("Received message:", req.body);
    res.status(200).end();
  })
  .listen(PORT, () => console.log(✅ Bot server running on ${PORT}));

// Set webhook (run once)
require('axios').get(https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook?url=${process.env.RENDER_EXTERNAL_URL}/webhook);
