import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.PERPLEXITY_API_KEY;

app.post("/api/chat", async (req, res) => {
  try {
    const { userMessage } = req.body;

    const response = await fetch(
      "https://api.perplexity.ai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [
            {
              role: "system",
              content:
                "You are an expert AI health advisor specializing in athletic nutrition and fitness.",
            },
            {
              role: "user",
              content: userMessage,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Perplexity error:", data);
      return res.status(500).json({ error: data });
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) return res.status(500).json({ error: "No reply returned" });

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);




