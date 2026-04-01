const axios = require("axios");

exports.handleChat = async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: message }],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
            }
        );

        return res.json({
            reply: response.data.choices[0].message.content,
        });
    } catch (error) {
        console.error("ERROR:", error.response?.data || error.message);

        // ✅ fallback logic (IMPORTANT)
        if (
            error.response &&
            error.response.data &&
            error.response.data.error &&
            error.response.data.error.code === "insufficient_quota"
        ) {
            return res.json({
                reply:
                    "⚠️ OpenAI quota exceeded. Please add billing to continue. (Temporary fallback response working)",
            });
        }

        return res.status(500).json({
            error: "Error fetching response from OpenAI",
        });
    }
};