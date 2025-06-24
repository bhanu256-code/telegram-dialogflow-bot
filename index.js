const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const TELEGRAM_TOKEN = "8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI";
const TELEGRAM_API_URL = https://api.telegram.org/bot${TELEGRAM_TOKEN};

const projectId = "YOUR_DIALOGFLOW_PROJECT_ID";
const sessionId = "123456";
const dialogflowToken = "YOUR_DIALOGFLOW_AUTH_TOKEN";

app.post("/webhook", async (req, res) => {
  const message = req.body.message;
  if (!message || !message.text) return res.sendStatus(200);

  const userMessage = message.text;
  const chatId = message.chat.id;

  try {
    const url = https://dialogflow.googleapis.com/v2/projects/${projectId}/agent/sessions/${sessionId}:detectIntent;

    const response = await axios.post(
      url,
      {
        queryInput: {
          text: {
            text: userMessage,
            languageCode: "en",
          },
        },
      },
      {
        headers: {
          Authorization: Bearer ${dialogflowToken},
        },
      }
    );

    const reply = response.data.queryResult.fulfillmentText || "Sorry, I didn't understand that.";

    await axios.post(${TELEGRAM_API_URL}/sendMessage, {
      chat_id: chatId,
      text: reply,
    });
  } catch (error) {
    console.error("Error:", error.message);

    await axios.post(${TELEGRAM_API_URL}/sendMessage, {
      chat_id: chatId,
      text: "Something went wrong. Please try again.",
    });
  }

  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(Server is running on port ${PORT});
});
