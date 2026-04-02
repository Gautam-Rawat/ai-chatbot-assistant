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
  const { message } = req.body;

  console.log("Incoming message:", message);

  // ❌ REMOVE sessionId requirement completely
  if (!message) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  const lowerMessage = message.toLowerCase();

  for (let faq of faqData) {
    if (lowerMessage.includes(faq.question)) {
      return res.json({ reply: faq.answer });
    }
  }

  return res.json({
    reply:
      "I'm still learning. Please ask something related to college or company.",
  });
};