const express = require("express");
const axios = require("axios");

const router = express.Router();

// LiteLLM URL
const LITELLM_URL = "http://localhost:36892/chat/completions";
// =========================
// AI Chat Route
// ===========================
router.post("/", async (req, res) => {
    try {
        const { message } = req.body;

        if (!global.documentText) {
            return res.status(400).json({
                success: false,
                error: "Please upload a document first.",
            });
        }

        const prompt = `
You are an AI Document Assistant.

Document Name:
${global.documentName}

Document Content:
${global.documentText}

User Question:
${message}

Instructions:
1. Answer ONLY from the uploaded document.
2. If the answer is not available, reply:
"I couldn't find that information in the uploaded document."
`;

        const response = await axios.post(LITELLM_URL, {
            model: "groq-llama",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        res.json({
            success: true,
            answer: response.data.choices[0].message.content,
        });

    } catch (error) {

        console.error(error.response?.data || error.message);

        res.status(500).json({
            success: false,
            error: error.response?.data || error.message,
        });

    }
});

// ===========================
// Document Summary Route
// ===========================
router.post("/summary", async (req, res) => {

    try {

        if (!global.documentText) {
            return res.status(400).json({
                success: false,
                error: "Please upload a document first.",
            });
        }

        const prompt = `
You are an AI Document Assistant.

Summarize the following document in simple, professional language.

Document Name:
${global.documentName}

Document Content:
${global.documentText}

Instructions:
1. Give a concise summary.
2. Highlight the important points.
3. Keep the summary between 100 and 200 words.
`;

        const response = await axios.post(LITELLM_URL, {
            model: "groq-llama",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        res.json({
            success: true,
            summary: response.data.choices[0].message.content,
        });

    } catch (error) {

        console.error(error.response?.data || error.message);

        res.status(500).json({
            success: false,
            error: error.response?.data || error.message,
        });

    }

});

module.exports = router;