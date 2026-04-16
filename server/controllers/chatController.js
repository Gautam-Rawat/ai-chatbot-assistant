const axios = require("axios");

const faqData = [
  {
    question: "hello",
    answer: "Hello! How can I assist you today?",
  },
  {
    question: "what is your name",
    answer: "I am an AI Chatbot Assistant.",
  },
  {
    question: "what can you do",
    answer:
      "I can answer questions related to college, companies, and general queries.",
  },
  {
    question: "college",
    answer:
      "Colleges provide education, courses, and degrees in various fields.",
  },
  {
    question: "company",
    answer:
      "A company is an organization that produces goods or services.",
  },
];

exports.handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const lowerMessage = message.toLowerCase();

    // ✅ STEP 1: Check FAQ first
    for (let faq of faqData) {
      if (lowerMessage.includes(faq.question)) {
        return res.json({ reply: faq.answer });
      }
    }

    // ✅ STEP 2: If not found → call Gemini
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: message }],
          },
        ],
      }
    );

    const reply =
      response.data.candidates[0].content.parts[0].text;

    return res.json({ reply });

  } catch (error) {
    console.error(error.response?.data || error.message);

    return res.status(500).json({
      error: "Something went wrong",
    });
  }
};