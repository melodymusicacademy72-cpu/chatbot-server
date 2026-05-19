const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {

  const userMessage = req.body.message;

  try {

    const response = await fetch(
      "https://prod-1-data.ke.pinecone.io/assistant/chat/melodychatbotfnl",
      {
        method: "POST",
        headers: {
          "Api-Key": process.env.PINECONE_API_KEY,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: userMessage
            }
          ],
          stream: false,
          model: "gpt-4o"
        })
      }
    );

    const text = await response.text();

    console.log(text);

    let reply = text;

    try {

      const data = JSON.parse(text);

      if (data.message && data.message.content) {
        reply = data.message.content;
      }
      else if (data.answer) {
        reply = data.answer;
      }

    } catch (e) {

      reply = text;

    }

    res.json({ reply });

  } catch (error) {

    console.log(error);

    res.json({
      reply: "⚠️ Server error. Please try again later."
    });

  }

});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});