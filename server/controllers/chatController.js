const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Load FAQ data
const faqPath = path.join(__dirname, "../data/faq.json");
const faqData = JSON.parse(fs.readFileSync(faqPath, "utf-8"));

// Simple memory (context)
let conversationHistory = [];

exports.handleChat = async (req, res) => {
  const { message } = req.body;

  const userMessage = message.toLowerCase();

  // Store user message in memory
  conversationHistory.push({ role: "user", content: message });

  // ✅ STEP 1: Check FAQ FIRST (fast + free)
  const matchedFAQ = faqData.find((item) =>
    userMessage.includes(item.question)
  );

  if (matchedFAQ) {
    const reply = matchedFAQ.answer;

    conversationHistory.push({ role: "assistant", content: reply });

    return res.json({ reply });
  }

  // ✅ STEP 2: Use OpenAI if no FAQ match
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
          ...conversationHistory
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    // Store AI reply
    conversationHistory.push({ role: "assistant", content: reply });

    return res.json({ reply });
  } catch (error) {
    console.error("ERROR:", error.response?.data || error.message);

    // fallback if quota exceeded
    if (
      error.response &&
      error.response.data &&
      error.response.data.error &&
      error.response.data.error.code === "insufficient_quota"
    ) {
      return res.json({
        reply:
          "⚠️ OpenAI quota exceeded. But FAQ system is still working. Try asking predefined questions.",
      });
    }

    return res.status(500).json({
      error: "Error fetching response from AI",
    });
  }
};