// --------------------- Telegram Setup ---------------------
const TELEGRAM_TOKEN = "8105233862:AAFWbwNfkBcX5Ng5mpVF6jd8JcaZq7RQZnI";
const TELEGRAM_API = "https://api.telegram.org/bot" + TELEGRAM_TOKEN;

let lastUpdateId = 0;

// --------------------- Firebase Setup ---------------------
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, set } = require("firebase/database");

const firebaseConfig = {
  apiKey: "AIzaSyDvXnr1_fVWgNIDO0rDY6mTU4EldDmMrAY",
  authDomain: "evbatterymonitor-4c65d.firebaseapp.com",
  databaseURL: "https://evbatterymonitor-4c65d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "evbatterymonitor-4c65d",
  storageBucket: "evbatterymonitor-4c65d.appspot.com",
  messagingSenderId: "499527178695",
  appId: "1:499527178695:web:d65a1f85b92f01af0021e2",
  measurementId: "G-RBZH15K722"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// --------------------- Web Server for Render ---------------------
require('http').createServer((req, res) => {
  res.end('Bot is running');
}).listen(3000);

// --------------------- Main Bot Logic ---------------------
async function checkMessages() {
  try {
    const response = await fetch(TELEGRAM_API + "/getUpdates?offset=" + (lastUpdateId + 1));
    const data = await response.json();

    if (data.result?.length > 0) {
      for (const update of data.result) {
        const msg = update.message;
        lastUpdateId = update.update_id;

        console.log("Received:", msg.text);

        // ✅ Write to Firebase
        const messageRef = ref(db, "messages/" + msg.message_id);
        await set(messageRef, {
          user: msg.from.first_name,
          message: msg.text,
          timestamp: Date.now()
        });

        // ✅ Send Reply
        await fetch(TELEGRAM_API + "/sendMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: msg.chat.id,
            text: "Hello! You said: " + msg.text
          })
        });
      }
    }
  } catch (error) {
    console.log("Error:", error.message);
  }

  setTimeout(checkMessages, 3000); // Repeat every 3 seconds
}

console.log("🤖 Bot started successfully");
checkMessages();
