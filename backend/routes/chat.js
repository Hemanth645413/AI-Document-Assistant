const express = require("express");
const Groq = require("groq-sdk");

const router = express.Router();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// ===========================
// AI Chat Route
// ===========================
router.post("/", async (req, res) => {

    console.log("🔥 AI Chat API Called");

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

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.3,
        });

        console.log("✅ AI Response Generated");

        res.json({
            success: true,
            answer: completion.choices[0].message.content,
        });

    } catch (error) {

        console.error("❌ AI Chat Error");
        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message,
        });

    }

});

// ===========================
// Document Summary Route
// ===========================
router.post("/summary", async (req, res) => {

    console.log("📄 Summary API Called");

    try {

        if (!global.documentText) {
            return res.status(400).json({
                success: false,
                error: "Please upload a document first.",
            });
        }

        const prompt = `
Summarize the following document.

Document Name:
${global.documentName}

Document Content:
${global.documentText}

Instructions:
1. Give a concise summary.
2. Highlight important points.
3. Keep it between 100 and 200 words.
`;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.3,
        });

        console.log("✅ Summary Generated");

        res.json({
            success: true,
            summary: completion.choices[0].message.content,
        });

    } catch (error) {

        console.error("❌ Summary Error");
        console.error(error);

        res.status(500).json({
            success: false,
            error: error.message,
        });

    }

});

module.exports = router;