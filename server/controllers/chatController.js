const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Load FAQ data
const faqPath = path.join(__dirname, "../data/faq.json");
const faqData = JSON.parse(fs.readFileSync(faqPath, "utf-8"));

// In-memory session storage
const sessions = {};

// Limit conversation length (avoid memory leak)
const MAX_HISTORY = 10;

exports.handleChat = async (req, res) => {
  const { message, sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({
      error: "sessionId is required",
    });
  }

  // Initialize session if not exists
  if (!sessions[sessionId]) {
    sessions[sessionId] = [];
  }

  const userMessage = message.toLowerCase();

  // Add user message
  sessions[sessionId].push({ role: "user", content: message });

  // Limit history size
  if (sessions[sessionId].length > MAX_HISTORY) {
    sessions[sessionId] = sessions[sessionId].slice(-MAX_HISTORY);
  }

  // ✅ STEP 1: FAQ check
  const matchedFAQ = faqData.find((item) =>
    userMessage.includes(item.question)
  );

  if (matchedFAQ) {
    const reply = matchedFAQ.answer;

    sessions[sessionId].push({ role: "assistant", content: reply });

    return res.json({ reply });
  }

  // ✅ STEP 2: OpenAI call
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant that helps with college and company-related queries.",
          },
          ...sessions[sessionId],
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    sessions[sessionId].push({ role: "assistant", content: reply });

    return res.json({ reply });
  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);

    if (
      error.response &&
      error.response.data &&
      error.response.data.error &&
      error.response.data.error.code === "insufficient_quota"
    ) {
      return res.json({
        reply:
          "⚠️ OpenAI quota exceeded. FAQ system is still working.",
      });
    }

    return res.status(500).json({
      error: "Error fetching response from AI",
    });
  }
};