import express from "express";
import fetch from "node-fetch";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

const firebaseConfig = {
  apiKey: process.env.FB_API_KEY,
  authDomain: process.env.FB_AUTH_DOMAIN,
  databaseURL: process.env.FB_DB_URL,
  projectId: process.env.FB_PROJECT_ID,
  storageBucket: process.env.FB_STORAGE_BUCKET,
  messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
  appId: process.env.FB_APP_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const tempRef = ref(database, "battery/temperature");
const currentRef = ref(database, "battery/current");

let lastTemp = null;
let lastCurrent = null;

function sendMessage(message) {
  const url = https://api.telegram.org/bot${botToken}/sendMessage;
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  })
    .then((res) => res.json())
    .then((data) => console.log("Sent:", data))
    .catch((err) => console.error("Telegram Error:", err));
}

// Watch Temperature
onValue(tempRef, (snapshot) => {
  const temp = snapshot.val();
  if (temp !== lastTemp) {
    sendMessage(🌡 Battery Temperature: ${temp}°C);
    lastTemp = temp;
  }
});

// Watch Current
onValue(currentRef, (snapshot) => {
  const current = snapshot.val();
  if (current !== lastCurrent) {
    sendMessage(🔋 Battery Current: ${current} A);
    lastCurrent = current;
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(EV Bot server running on port ${PORT});
});
